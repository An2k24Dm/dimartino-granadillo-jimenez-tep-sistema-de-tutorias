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
}
