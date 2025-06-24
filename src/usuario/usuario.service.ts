import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './usuario.entity';
import { Estudiante } from '../estudiante/estudiante.entity';
import { Tutor } from '../tutor/tutor.entity';
import { Coordinador } from '../coordinador/coordinador.entity';

@Injectable()
export class UsuarioService {
    constructor(
        @InjectRepository(Usuario)
        private readonly usuarioRepo: Repository<Usuario>,
        private readonly dataSource: DataSource,
    ) {}

    async verificarRol(usuarioId: number): Promise<'estudiante' | 'tutor' | 'coordinador'> {
        const estudiante = await this.dataSource
        .getRepository(Estudiante)
        .findOne({ where: { usuario: { id: usuarioId } } });

        if (estudiante) return 'estudiante';

        const tutor = await this.dataSource
        .getRepository(Tutor)
        .findOne({ where: { usuario: { id: usuarioId } } });

        if (tutor) return 'tutor';

        const coordinador = await this.dataSource
        .getRepository(Coordinador)
        .findOne({ where: { usuario: { id: usuarioId } } });

        if (coordinador) return 'coordinador';

        throw new NotFoundException('El usuario no tiene rol asignado');
    }

    async buscarPorCorreo(correo: string): Promise<Usuario | null> {
        return this.usuarioRepo.findOne({ where: { correo } });
    }
}
