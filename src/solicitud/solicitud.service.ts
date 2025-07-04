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

@Injectable()
export class SolicitudService {
  constructor(
    @InjectRepository(Solicitud)
    private solicitudRepository: Repository<Solicitud>,
    @InjectRepository(Materia)
    private materiaRepository: Repository<Materia>,
        @InjectRepository(Tutor) 
    private tutorRepository: Repository<Tutor>,
  ) {}

  async createSolicitud(
    crearSolicitudDto: CrearSolicitudDto,
    estudianteId: number,
  ): Promise<Solicitud> {
    const { codigoMateria, fechaSolicitada, horaSolicitada, cedulaTutor } =
      crearSolicitudDto;

    const materia = await this.materiaRepository.findOne({
      where: { codigo: codigoMateria },
    });

    if (!materia) {
      throw new NotFoundException(
        `Materia con código ${codigoMateria} no encontrada.`,
      );
    }
    
    // Find the Tutor by their cedula
    const tutor = await this.tutorRepository.findOne({
      where: { cedula: cedulaTutor }, // Assuming 'cedula' is a field in your Tutor entity
    });

    if (!tutor) {
      throw new NotFoundException(
        `Tutor con cédula ${cedulaTutor} no encontrado.`,
      );
    }
       if (!tutor.materia) {
      throw new BadRequestException(
        `El tutor con cédula ${cedulaTutor} no tiene materias asignadas y no puede recibir solicitudes.`,
      );
    }

    const newSolicitud = this.solicitudRepository.create({
      estudianteId,
      materiaId: materia.id,
      fechaSolicitada: new Date(fechaSolicitada),
      horaSolicitada: new Date(`2000-01-01T${horaSolicitada}`), // Using a dummy date for time
      estado: 'Pendiente', // Initial state
      tutorId: tutor.id,
    });

    return this.solicitudRepository.save(newSolicitud);
  }

  async findSolicitudesAsignadasTutor(tutorId: number): Promise<Solicitud[]> {
    return this.solicitudRepository.find({
      where: { tutorId: tutorId },
      relations: ['estudiante', 'materia'], // Load related student and materia data
    });
  }

async aceptarSolicitud(id: number, tutorId: number): Promise<Solicitud> {
    const solicitud = await this.solicitudRepository.findOne({
      where: { id: id, tutorId: tutorId },
    });

    if (!solicitud) {
      throw new NotFoundException(
        `Solicitud con ID ${id} no encontrada o no asignada a este tutor.`,
      );
    }

    // Validation: Only 'Pendiente' requests can be accepted
    if (solicitud.estado !== 'Pendiente') {
      throw new BadRequestException(
        `La solicitud ${id} no está en estado Pendiente y no puede ser aceptada.`,
      );
    }

    solicitud.estado = 'Aceptada';
    return this.solicitudRepository.save(solicitud);
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

    // Validation: Only 'Pendiente' requests can be rejected
    if (solicitud.estado !== 'Pendiente') {
      throw new BadRequestException(
        `La solicitud ${id} no está en estado Pendiente y no puede ser rechazada.`,
      );
    }

    solicitud.estado = 'Rechazada';
    return this.solicitudRepository.save(solicitud);
  }
}