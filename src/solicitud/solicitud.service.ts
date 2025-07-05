// solicitud.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Solicitud } from './solicitud.entity';
import { CrearSolicitudDto } from '../solicitud/dto/crear_solicitud.dto';
import { Materia } from '../materia/materia.entity'; 
import { Tutor } from 'src/tutor/tutor.entity';
import { Sesion } from '../sesion/sesion.entity';

@Injectable()
export class SolicitudService {
  constructor(
    @InjectRepository(Solicitud)
    private solicitudRepository: Repository<Solicitud>,
    @InjectRepository(Materia)
    private materiaRepository: Repository<Materia>,
    @InjectRepository(Tutor) 
    private tutorRepository: Repository<Tutor>,
    @InjectRepository(Sesion) 
    private sesionRepository: Repository<Sesion>
  ) {}

async createSolicitud(
  crearSolicitudDto: CrearSolicitudDto,
  estudianteId: number,
): Promise<Solicitud> {
  const { fechaSolicitada, horaSolicitada, cedulaTutor } = crearSolicitudDto;

  // Buscar tutor
  const tutor = await this.tutorRepository.findOne({
    where: { cedula: cedulaTutor },
    relations: ['materia'],
  });

  if (!tutor) {
    throw new NotFoundException(`Tutor con cédula ${cedulaTutor} no encontrado.`);
  }

  if (!tutor.materia) {
    throw new BadRequestException(
      `El tutor con cédula ${cedulaTutor} no tiene materias asignadas y no puede recibir solicitudes.`,
    );
  }

  const assignedMateria = tutor.materia;

  // Crear solicitud
  const newSolicitud = this.solicitudRepository.create({
    estudiante: { id: estudianteId }, // Usamos objeto para asociar
    materia: { id: assignedMateria.id },
    fechaSolicitada: new Date(fechaSolicitada),
    horaSolicitada: horaSolicitada, // tipo string si usas 'time'
    estado: 'Pendiente',
    tutor: { id: tutor.id },
  });

  const savedSolicitud = await this.solicitudRepository.save(newSolicitud);

  // Recargar con relaciones para traer nombres
  const solicitudWithRelations = await this.solicitudRepository.findOne({
    where: { id: savedSolicitud.id },
    relations: ['estudiante', 'tutor', 'materia'],
  });
if (!solicitudWithRelations) {
  throw new NotFoundException(`Solicitud con ID ${savedSolicitud.id} no encontrada al recargar.`);
}
  return solicitudWithRelations;
}

  async findSolicitudesAsignadasTutor(tutorId: number): Promise<Solicitud[]> {
    return this.solicitudRepository.find({
      where: { tutorId: tutorId },
      relations: ['estudiante', 'materia'], // Load related student and materia data
    });
  }

async aceptarSolicitud(id: number, tutorId: number): Promise<Solicitud> {
  const solicitud = await this.solicitudRepository.findOne({
    where: { id: id, tutor: { id: tutorId } },
    relations: ['estudiante', 'tutor', 'materia'],
  });

  if (!solicitud) {
    throw new NotFoundException(`Solicitud con ID ${id} no encontrada o no asignada a este tutor.`);
  }

  if (solicitud.estado !== 'Pendiente') {
    throw new BadRequestException(
      `La solicitud ${id} no está en estado Pendiente y no puede ser aceptada.`,
    );
  }

  solicitud.estado = 'Aceptada';
  const acceptedSolicitud = await this.solicitudRepository.save(solicitud);

  // Crear sesión
const newSesion = this.sesionRepository.create({
  solicitud: { id: acceptedSolicitud.id },
  estudiante: { id: acceptedSolicitud.estudiante.id },
  tutor: { id: acceptedSolicitud.tutor.id },
  materia: { id: acceptedSolicitud.materia.id },
  fechaSesion: acceptedSolicitud.fechaSolicitada,
  horaSesion: acceptedSolicitud.horaSolicitada,
  completada: false,
});

  await this.sesionRepository.save(newSesion);

  return acceptedSolicitud;
}

  async rechazarSolicitud(id: number, tutorId: number): Promise<Solicitud> {
    const solicitud = await this.solicitudRepository.findOne({
      where: { id: id, tutorId: tutorId },
    });

    if (!solicitud) {
      throw new NotFoundException(
        `Solicitud con ID ${id} no encontrada o no asignada a este tutor.`,
      );
    }

    if (solicitud.estado !== 'Pendiente') {
      throw new BadRequestException(
        `La solicitud ${id} no está en estado Pendiente y no puede ser rechazada.`,
      );
    }

    solicitud.estado = 'Rechazada';
    return this.solicitudRepository.save(solicitud);
  }
}