import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Calificacion } from './calificacion.entity';
import { CreateCalificacionDto } from './dto/asignar_calificacion.dto';
import { UpdateCalificacionDto } from './dto/modificar_calificacion.dto';
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

    async findOne(id: number): Promise<Calificacion> {
            const calificacion = await this.calificacionRepository.findOne({
            where: { id },
            relations: ['estudiante', 'sesion', 'tutor'],
            });
    
            if (!calificacion) {
            throw new NotFoundException(`CCalificacion con ID #${id} no encontrada.`);
            }
            return calificacion;
        }

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

  async update(
    id: number,
    updateCalificacionDto: UpdateCalificacionDto,
  ): Promise<Calificacion> {
    // 1. Busca la calificación existente para leer sus datos actuales.
    const calificacionExistente = await this.calificacionRepository.findOneBy({ id });
    if (!calificacionExistente) {
      throw new NotFoundException(`Calificación con ID #${id} no encontrada.`);
    }

    // 2. Verifica si en la petición se incluyó una nueva nota numérica
    // y si es diferente a la que ya existía.
    const seModificaLaNota =
      updateCalificacionDto.calificacion !== undefined &&
      updateCalificacionDto.calificacion !== calificacionExistente.calificacion;

    if (seModificaLaNota) {
      const comentarioPrevio = calificacionExistente.comentario || '';
      
      // 3. ¡NUEVA CONDICIÓN! Revisa si el texto ya ha sido añadido previamente.
      if (!comentarioPrevio.includes('/Calificacion modificada')) {
        // 4. Si no lo incluye, construye el nuevo comentario.
        const comentarioModificado = comentarioPrevio
          ? `${comentarioPrevio} /Calificacion modificada`
          : 'Calificacion modificada';

        // 5. Asigna el nuevo comentario al DTO que se usará para actualizar.
        updateCalificacionDto.comentario = comentarioModificado;
      }
      // Si el texto ya estaba, simplemente no se hace nada con el comentario.
    }

    // 6. Mezcla los cambios con la entidad existente.
    const calificacionActualizada = this.calificacionRepository.merge(
      calificacionExistente,
      updateCalificacionDto,
    );

    // 7. Guarda y devuelve el resultado final.
    return this.calificacionRepository.save(calificacionActualizada);
  }

    async remove(id: number): Promise<void> {
      // 1. Reutilizamos el método findOne para verificar que la calificación existe.
      // Si no existe, findOne lanzará automáticamente un error NotFoundException.
      const calificacion = await this.findOne(id);
  
      // 2. Si la encuentra, la elimina. El método remove() espera la entidad completa.
      await this.calificacionRepository.remove(calificacion);
      }

}
