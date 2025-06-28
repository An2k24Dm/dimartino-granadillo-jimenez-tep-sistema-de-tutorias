import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
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
        @InjectRepository(Estudiante)
        private estudianteRepo: Repository<Estudiante>,
        @InjectRepository(Coordinador)
        private coordinadorRepo: Repository<Coordinador>,
        @InjectRepository(Tutor)
        private tutorRepo: Repository<Tutor>,
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

    async encontrarTodos(): Promise<any[]> {
        const usuarios = await this.usuarioRepo.find();
        const usuariosConRoles = await Promise.all(
            usuarios.map(async (usuario) => {
            const estudiante = await this.estudianteRepo.findOne({ where: { id: usuario.id } });
            const coordinador = await this.coordinadorRepo.findOne({ where: { id: usuario.id } });
            const tutor = await this.tutorRepo.findOne({ where: { id: usuario.id } });

            return {
                ...usuario,
                estudiante,
                coordinador,
                tutor,
            };
            }),
        );
        return usuariosConRoles;
    }

    async eliminarUsuarioConRol(id: number): Promise<void> {
        try {
            await this.dataSource.transaction(async (manager) => {
            const usuario = await manager.findOne(Usuario, { where: { id } });

            if (!usuario) {
                throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
            }

            // Verificar si tiene algún rol y eliminarlo
            const estudiante = await manager.findOne(Estudiante, { where: { id } });
            if (estudiante) {
                await manager.delete(Estudiante, id);
            }

            const coordinador = await manager.findOne(Coordinador, { where: { id } });
            if (coordinador) {
                await manager.delete(Coordinador, id);
            }

            const tutor = await manager.findOne(Tutor, { where: { id } });
            if (tutor) {
                await manager.delete(Tutor, id);
            }

            // Finalmente, eliminar el usuario
            const result = await manager.delete(Usuario, id);
            if (result.affected === 0) {
                throw new NotFoundException(`Usuario con ID ${id} no encontrado al eliminar`);
            }
            });
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
                throw new InternalServerErrorException('Error al eliminar el usuario y sus datos asociados');
        }
    }
}
