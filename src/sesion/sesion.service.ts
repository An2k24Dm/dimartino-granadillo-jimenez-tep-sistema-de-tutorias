import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan, MoreThanOrEqual } from 'typeorm';
import { Sesion } from './sesion.entity';
import { Solicitud } from 'src/solicitud/solicitud.entity';
import { ActualizarSesionDto } from './dto/actualizar_sesion.dto';

@Injectable()
export class SesionService {
    constructor(
        @InjectRepository(Sesion)
        private readonly sesionRepository: Repository<Sesion>,
        @InjectRepository(Solicitud)
        private readonly solicitudRepository: Repository<Solicitud>,
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

    async eliminarSesion(sesionId: number): Promise<void> {
        const sesion = await this.sesionRepository.findOne({
            where: { id: sesionId },
            relations: ['solicitud'],
        });

        if (!sesion) {
            throw new NotFoundException(`Sesión con ID ${sesionId} no encontrada.`);
        }

        // Si la sesión tiene solicitud asociada, eliminarla
        if (sesion.solicitud) {
            await this.solicitudRepository.remove(sesion.solicitud);
        }

        await this.sesionRepository.remove(sesion);
    }

    async actualizarSesion(sesionId: number, dto: ActualizarSesionDto): Promise<Sesion> {
        const sesion = await this.sesionRepository.findOne({
            where: { id: sesionId },
            relations: ['solicitud'],
        });

        if (!sesion) {
            throw new NotFoundException(`Sesión con ID ${sesionId} no encontrada.`);
        }

        if (sesion.completada) {
            throw new BadRequestException('No se puede actualizar una sesión que ya está marcada como completada.');
        }

        // Validar que se envíe al menos una de las dos
        if (!dto.fechaSesion && !dto.horaSesion) {
            throw new BadRequestException('Debe proporcionar al menos una fecha U hora para actualizar.');
        }

        // Usar fecha y hora actual de la sesión por defecto
        const fechaActual = dto.fechaSesion ? dto.fechaSesion : sesion.fechaSesion.toISOString().split('T')[0];
        const horaActual = dto.horaSesion ? dto.horaSesion : sesion.horaSesion.toString().slice(0, 5);

        // Crear fecha completa combinada
        const fechaHoraStr = `${fechaActual}T${horaActual}:00`;
        const fechaHoraNueva = new Date(fechaHoraStr);
        const ahora = new Date();

        if (isNaN(fechaHoraNueva.getTime())) {
            throw new BadRequestException('La fecha u hora proporcionada no son válidas.');
        }

        if (fechaHoraNueva < ahora) {
            throw new BadRequestException('No se puede asignar una fecha u hora anterior a la actual.');
        }

        // Asignar nuevos valores a sesión
        if (dto.fechaSesion) {
            sesion.fechaSesion = new Date(dto.fechaSesion);
        }
        if (dto.horaSesion) {
            sesion.horaSesion = dto.horaSesion as any;
        }

        // Actualizar solicitud asociada
        if (dto.fechaSesion) {
            sesion.solicitud.fecha_solicitada = dto.fechaSesion;
        }
        if (dto.horaSesion) {
            sesion.solicitud.hora_solicitada = dto.horaSesion;
        }
        // Guardar sesión y solicitud (cascada no siempre actualiza)
        await this.solicitudRepository.save(sesion.solicitud);
        return this.sesionRepository.save(sesion);
    }
    
}