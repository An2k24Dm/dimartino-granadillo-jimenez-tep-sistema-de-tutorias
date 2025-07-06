import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Calificacion } from './calificacion.entity';
import { CreateCalificacionDto } from './dto/asignar_calificacion.dto';
import { Estudiante } from '../estudiante/estudiante.entity';
import { Tutor } from '../tutor/tutor.entity';
import { Sesion } from '../sesion/sesion.entity';

@Injectable()
export class CalificacionService {
    constructor(
        @InjectRepository(Calificacion)
        private readonly calificacionRepository: Repository<Calificacion>,
        @InjectRepository(Estudiante)
        private readonly estudianteRepository: Repository<Estudiante>,
        @InjectRepository(Tutor)
        private readonly tutorRepository: Repository<Tutor>,
        @InjectRepository(Sesion)
        private readonly sesionRepository: Repository<Sesion>,
    ) {}

    async createCalificacion(
  createCalificacionDto: CreateCalificacionDto,
  estudianteId: number,
): Promise<Calificacion> {
  const { calificacion, comentario, sesionId } = createCalificacionDto;

  // Buscar sesión con tutor
  const sesion = await this.sesionRepository.findOne({
    where: { id: sesionId},
    relations: ['tutor'],
  });

  if (!sesion) {
    throw new NotFoundException(`Sesión con id ${sesionId} no encontrada.`);
  }

  if (!sesion.tutor) {
    throw new BadRequestException(`La sesión con id ${sesionId} no tiene tutor asignado.`);
  }

  if (!sesion.completada){
    throw new BadRequestException(`La sesión con id ${sesionId} no ha sido completada.`);
  }

  // Validar si ya existe calificación
  const existingCalificacion = await this.calificacionRepository.findOne({
    where: {
      sesion: { id: sesionId },
    },
  });

  if (existingCalificacion) {
    throw new BadRequestException(`La sesión ya ha sido calificada.`);
  }

  // Crear usando new y asignar manualmente
  const newCalificacion = new Calificacion();
  newCalificacion.estudiante = { id: estudianteId } as Estudiante;
  newCalificacion.sesion = { id: sesionId } as Sesion;
  newCalificacion.calificacion = calificacion;
  newCalificacion.comentario = comentario || '';
  newCalificacion.tutor = { id: sesion.tutor.id } as Tutor;

  const savedCalificacion = await this.calificacionRepository.save(newCalificacion);

  // Recargar con relaciones
  const calificacionWithRelations = await this.calificacionRepository.findOne({
    where: { id: savedCalificacion.id },
    relations: ['estudiante', 'tutor', 'sesion'],
  });

  if (!calificacionWithRelations) {
    throw new NotFoundException(`Calificación con ID ${savedCalificacion.id} no encontrada al recargar.`);
  }

  return calificacionWithRelations;
}

}