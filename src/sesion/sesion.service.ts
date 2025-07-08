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
}