import { Injectable, NotFoundException, BadRequestException, } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Solicitud } from './solicitud.entity';
import { Estudiante } from '../estudiante/estudiante.entity';
import { Tutor } from '../tutor/tutor.entity';
import { Materia } from '../materia/materia.entity';
import { CrearSolicitudCordinadorDto } from './dto/crear_solicitudCordinador.dto';
import { CrearSolicitudDto } from './dto/crear_solicitud.dto';
import { ActualizarSolicitudDto } from './dto/actualizar_solicitud.dto';
import { Sesion } from '../sesion/sesion.entity';

@Injectable()
export class SolicitudService {
  constructor(
    @InjectRepository(Solicitud)
    private readonly solicitudRepository: Repository<Solicitud>,
    @InjectRepository(Estudiante)
    private readonly estudianteRepository: Repository<Estudiante>,
    @InjectRepository(Tutor)
    private readonly tutorRepository: Repository<Tutor>,
    @InjectRepository(Materia)
    private readonly materiaRepository: Repository<Materia>,
    @InjectRepository(Sesion) 
    private sesionRepository: Repository<Sesion>
  ) {}

  findAll(): Promise<Solicitud[]> {
    return this.solicitudRepository.find({
    relations: ['estudiante', 'tutor', 'materia'],
    });
  }

  async findOne(id: number): Promise<Solicitud> {
    const solicitud = await this.solicitudRepository.findOne({
    where: { id },
    relations: ['estudiante', 'tutor', 'materia'],
    });

    if (!solicitud) {
    throw new NotFoundException(`Solicitud con ID #${id} no encontrada.`);
    }
    return solicitud;
  }

  async update(id: number, actualizarSolicitudDto: ActualizarSolicitudDto): Promise<Solicitud> {
    const solicitud = await this.findOne(id);
    const { fecha_solicitada, hora_solicitada } = actualizarSolicitudDto;

    if (!fecha_solicitada && !hora_solicitada) {
      throw new BadRequestException('Debe proporcionar al menos una fecha u hora para actualizar la solicitud.');
    }

    if (solicitud.estado !== 'Pendiente') {
      throw new BadRequestException('No se puede actualizar una solicitud que no está en estado Pendiente.');
    }

    if (fecha_solicitada) {
      const parsedDate = new Date(fecha_solicitada);
      if (isNaN(parsedDate.getTime())) {
        throw new BadRequestException(`La fecha proporcionada no es válida: ${fecha_solicitada}`);
      }
    }

    this.solicitudRepository.merge(solicitud, actualizarSolicitudDto);
    return this.solicitudRepository.save(solicitud);
  }

  async remove(id: number): Promise<void> {
    const solicitud = await this.findOne(id); 
    await this.solicitudRepository.remove(solicitud);
    console.log(`Solicitud con ID #${id} eliminada correctamente.`);
  }

  async createSolicitud(
    crearSolicitudDto: CrearSolicitudDto,
    estudianteId: number,
  ): Promise<Solicitud> {
    const { fecha_solicitada, hora_solicitada, cedulaTutor } = crearSolicitudDto;

    // Validar fecha y hora
    const fechaStr = fecha_solicitada;
    const horaStr = hora_solicitada;

    const fechaHoraStr = `${fechaStr}T${horaStr}:00`;
    const fechaHoraSolicitada = new Date(fechaHoraStr);
    const ahora = new Date();

    if (isNaN(fechaHoraSolicitada.getTime())) {
      throw new BadRequestException('La fecha u hora solicitada no es válida.');
    }

    if (fechaHoraSolicitada < ahora) {
      throw new BadRequestException('No puedes seleccionar una fecha u hora anterior a la actual.');
    }

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

    // Validar si ya existe una solicitud
    const existingSolicitud = await this.solicitudRepository.findOne({
      where: {
        estudiante: { id: estudianteId },
        tutor: { id: tutor.id },
        fecha_solicitada: new Date(fecha_solicitada).toISOString().split('T')[0], 
      },
    });

    if (existingSolicitud) {
      throw new BadRequestException(
        `Ya existe una solicitud para este estudiante con ese tutor, el día ${fecha_solicitada}.`,
      );
    }

    // Crear solicitud
    const newSolicitud = this.solicitudRepository.create({
      estudiante: { id: estudianteId }, 
      materia: { id: assignedMateria.id },
      fecha_solicitada: new Date(fecha_solicitada).toISOString().split('T')[0], 
      hora_solicitada: hora_solicitada, 
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

  async createSolicitud(
    crearSolicitudDto: CrearSolicitudDto,
    estudianteId: number,
  ): Promise<Solicitud> {
    const { fecha_solicitada, hora_solicitada, cedulaTutor } = crearSolicitudDto;

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

    // Validar si ya existe una solicitud
    const existingSolicitud = await this.solicitudRepository.findOne({
      where: {
        estudiante: { id: estudianteId },
        tutor: { id: tutor.id },
        fecha_solicitada: new Date(fecha_solicitada).toISOString().split('T')[0], 
      },
    });

    if (existingSolicitud) {
      throw new BadRequestException(
        `Ya existe una solicitud para este estudiante con ese tutor, el día ${fecha_solicitada}.`,
      );
    }

    // Crear solicitud
    const newSolicitud = this.solicitudRepository.create({
      estudiante: { id: estudianteId }, 
      materia: { id: assignedMateria.id },
      fecha_solicitada: new Date(fecha_solicitada).toISOString().split('T')[0], 
      hora_solicitada: hora_solicitada, 
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
      where: { tutor: { id: tutorId } },
      relations: ['estudiante', 'materia'], 
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
    if (!acceptedSolicitud.tutor) {
      throw new NotFoundException(`El tutor asociado a la solicitud aceptada no se encuentra.`);
    }

    const newSesion = this.sesionRepository.create({
      solicitud: { id: acceptedSolicitud.id },
      estudiante: { id: acceptedSolicitud.estudiante.id },
      tutor: { id: acceptedSolicitud.tutor.id },
      materia: { id: acceptedSolicitud.materia.id },
      fechaSesion: acceptedSolicitud.fecha_solicitada,
      horaSesion: acceptedSolicitud.hora_solicitada,
      completada: false,
    });

    await this.sesionRepository.save(newSesion);

    return acceptedSolicitud;
  }

  async rechazarSolicitud(id: number, tutorId: number): Promise<Solicitud> {
    const solicitud = await this.solicitudRepository.findOne({
      where: { id: id, tutor: { id: tutorId } },
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