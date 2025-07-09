import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan, MoreThanOrEqual } from 'typeorm';
import { Sesion } from './sesion.entity';

@Injectable()
export class SesionService {
    constructor(
        @InjectRepository(Sesion)
        private readonly sesionRepository: Repository<Sesion>,
    ) {}

    async listarSesionesPorTutor(tutorId: number) {
        const today = new Date();
        const todayDate = new Date(today.toISOString().split('T')[0]);

        const sesionesPasadas = await this.sesionRepository.find({
            where: {
            tutor: { id: tutorId },
            fechaSesion: LessThan(todayDate),
            },
            relations: ['estudiante', 'materia', 'solicitud'],
            order: { fechaSesion: 'DESC' },
        });

        const sesionesFuturas = await this.sesionRepository.find({
            where: {
            tutor: { id: tutorId },
            fechaSesion: MoreThanOrEqual(todayDate),
            },
            relations: ['estudiante', 'materia', 'solicitud'],
            order: { fechaSesion: 'ASC' },
        });

        return {
            sesionesPasadas,
            sesionesFuturas,
        };
    }

    async marcarSesionCompletada(sesionId: number, tutorId: number): Promise<Sesion> {
        const sesion = await this.sesionRepository.findOne({
            where: { id: sesionId },
            relations: ['tutor'],
        });

        if (!sesion) {
            throw new NotFoundException(`Sesión con ID ${sesionId} no encontrada.`);
        }

        if (sesion.tutor.id !== tutorId) {
            throw new BadRequestException(`No tienes permiso para marcar esta sesión.`);
        }

        if (sesion.completada) {
            throw new BadRequestException(`La sesión ya está marcada como completada.`);
        }

        sesion.completada = true;
        await this.sesionRepository.save(sesion);

        return sesion;
    }

    async listarTodasSesiones(limit = 10, offset = 0): Promise<{ data: Sesion[]; total: number }> {
        const [data, total] = await this.sesionRepository.findAndCount({
            relations: ['estudiante', 'tutor', 'materia', 'solicitud'],
            take: limit,
            skip: offset,
            order: { fechaSesion: 'ASC' },
        });

        return {
            data,
            total,
        };
    }

    async filtrarSesiones(
        tutorId?: number,
        materiaId?: number,
        fechaSesion?: string,
        estadoSesion?: boolean,
        limit = 10,
        offset = 0,
        ): Promise<{ data: Sesion[]; total: number; count: number; limit: number; offset: number }> {
        const queryBuilder = this.sesionRepository.createQueryBuilder('sesion')
            .leftJoinAndSelect('sesion.tutor', 'tutor')
            .leftJoinAndSelect('sesion.materia', 'materia')
            .leftJoinAndSelect('sesion.estudiante', 'estudiante')
            .leftJoinAndSelect('sesion.solicitud', 'solicitud');

        if (tutorId) {
            queryBuilder.andWhere('tutor.id = :tutorId', { tutorId });
        }

        if (materiaId) {
            queryBuilder.andWhere('materia.id = :materiaId', { materiaId });
        }

        if (fechaSesion) {
            queryBuilder.andWhere('sesion.fechaSesion = :fechaSesion', { fechaSesion });
        }

        if (estadoSesion !== undefined) {
            queryBuilder.andWhere('sesion.completada = :estadoSesion', { estadoSesion });
        }

        queryBuilder.take(limit).skip(offset).orderBy('sesion.fechaSesion', 'ASC');

        const [data, total] = await queryBuilder.getManyAndCount();

        return {
            data,
            total,
            count: data.length,
            limit,
            offset,
        };  
    }

    async estadisticasSesionesPorTutor(): Promise<{ tutorId: number; cantidad: number }[]> {
        const result = await this.sesionRepository
            .createQueryBuilder('sesion')
            .select('sesion.tutor_id', 'tutorId')
            .addSelect('COUNT(*)', 'cantidad')
            .where('sesion.completada = true')
            .groupBy('sesion.tutor_id')
            .getRawMany();
        return result;
    }

    async estadisticasSesionesPorMateria(): Promise<{ materiaId: number; cantidad: number }[]> {
        const result = await this.sesionRepository
            .createQueryBuilder('sesion')
            .select('sesion.materia_id', 'materiaId')
            .addSelect('COUNT(*)', 'cantidad')
            .where('sesion.completada = true')
            .groupBy('sesion.materia_id')
            .getRawMany();
        return result;
    }
}