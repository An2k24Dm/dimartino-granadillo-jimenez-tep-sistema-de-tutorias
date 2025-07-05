import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Solicitud } from './solicitud.entity';
import { Estudiante } from '../estudiante/estudiante.entity';
import { Tutor } from '../tutor/tutor.entity';
import { Materia } from '../materia/materia.entity';
import { CrearSolicitudDto } from './dto/crear_solicitud.dto';
import { ActualizarSolicitudDto } from './dto/actualizar_solicitud.dto';

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
    ) {}

    async create(createSolicitudDto: CrearSolicitudDto): Promise<Solicitud> {
        console.log('Datos recibidos para crear solicitud:', createSolicitudDto);
    const { estudiante_id, materia_id, tutor_id, ...solicitudData } = createSolicitudDto;
    const estudiante = await this.estudianteRepository.findOneBy({ id: estudiante_id });
    if (!estudiante) {
      throw new NotFoundException(`Estudiante con ID #${estudiante_id} no encontrado.`);
    }

    const materia = await this.materiaRepository.findOneBy({ id: materia_id });
    if (!materia) {
      throw new NotFoundException(`Materia con ID #${materia_id} no encontrada.`);
    }
    const solicitudParaCrear: Partial<Solicitud> = {
      ...solicitudData,
      estudiante,
      materia,
    };
    if (tutor_id) {
      const tutor = await this.tutorRepository.findOneBy({ id: tutor_id });
      
      if (!tutor) {
        throw new NotFoundException(`Tutor con ID #${tutor_id} no encontrado.`);
      }
      solicitudParaCrear.tutor = tutor; 
    }

    const nuevaSolicitud = this.solicitudRepository.create(solicitudParaCrear);

    return this.solicitudRepository.save(nuevaSolicitud);
  }

    findAll(): Promise<Solicitud[]> {
        return this.solicitudRepository.find({
        relations: ['estudiante', 'tutor', 'materia'],
        });
    }

    /**
     * Busca y devuelve una única solicitud por su ID.
     * Lanza un error si no se encuentra.
     */
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

    /**
     * Actualiza una solicitud existente por su ID.
     */
    async update(id: number, actualizarSolicitudDto: ActualizarSolicitudDto): Promise<Solicitud> {
        const solicitud = await this.findOne(id);

        const { estudianteId, materiaId, tutorId, ...data } = actualizarSolicitudDto;
        if (estudianteId) {
        const estudiante = await this.estudianteRepository.findOneBy({ id: estudianteId });
        if(!estudiante) throw new NotFoundException(`Estudiante con ID #${estudianteId} no encontrado.`);
        solicitud.estudiante = estudiante;
        }
        if (materiaId) {
        const materia = await this.materiaRepository.findOneBy({ id: materiaId });
        if(!materia) throw new NotFoundException(`Materia con ID #${materiaId} no encontrada.`);
        solicitud.materia = materia;
        }
        if (tutorId) {
        const tutor = await this.tutorRepository.findOneBy({ id: tutorId });
        if(!tutor) throw new NotFoundException(`Tutor con ID #${tutorId} no encontrado.`);
        solicitud.tutor = tutor;
        }
        this.solicitudRepository.merge(solicitud, data);

        return this.solicitudRepository.save(solicitud);
    }

    /**
     * Elimina una solicitud por su ID.
     */
    async remove(id: number): Promise<void> {
        const solicitud = await this.findOne(id); 
        await this.solicitudRepository.remove(solicitud);
        console.log(`Solicitud con ID #${id} eliminada correctamente.`);
    }
}