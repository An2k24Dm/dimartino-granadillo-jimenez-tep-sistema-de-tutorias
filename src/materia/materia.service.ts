import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tutor } from '../tutor/tutor.entity';
import { Usuario } from '../usuario/usuario.entity';
import { Materia } from './materia.entity';
import { Repository } from 'typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class MateriaService {
    constructor(
        @InjectRepository(Usuario)
        private readonly usuarioRepo: Repository<Usuario>,
        private readonly dataSource: DataSource,
        @InjectRepository(Tutor)
        private tutorRepo: Repository<Tutor>,
        @InjectRepository(Materia)
        private materiaRepo: Repository<Materia>,
    ) {}

    async encontrarTodos(): Promise<any[]> {
        try {
            const materias = await this.materiaRepo.find();
            if(!materias) throw new NotFoundException(`Materias no encontradas`);
            return materias;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            console.error('Error obteniendo las materias:', error);
            throw new InternalServerErrorException('Ocurrió un error al obtener las materias');
        }
    }

    async eliminarMateria(id: number): Promise<void> {
        try {
            await this.dataSource.transaction(async (manager) => {
                const materia = await manager.findOne(Materia, { where: { id } });
                if (!materia) {
                    throw new NotFoundException(`Materia con ID ${id} no encontrada`);
                }
                const tutor = await manager.findOne(Tutor, { // Verificar si algún tutor tiene asignada esta materia
                    where: { materia: { id } },
                    relations: ['materia'],
                });

                if (tutor) {
                    tutor.materia = undefined; // Quitar la relación de materia del tutor
                    await manager.save(Tutor, tutor);
                }

                const result = await manager.delete(Materia, id); // Eliminar la materia
                if (result.affected === 0) {
                    throw new NotFoundException(`Materia con ID ${id} no encontrada al eliminar`);
                }
            });
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            console.error('Error al eliminar materia:', error);
            throw new InternalServerErrorException('Error al eliminar la materia');
        }
    }
}
