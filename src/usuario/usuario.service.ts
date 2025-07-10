import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './usuario.entity';
import { Estudiante } from '../estudiante/estudiante.entity';
import { Tutor } from '../tutor/tutor.entity';
import { Coordinador } from '../coordinador/coordinador.entity';
import { ActualizarUsuarioCompletoDto } from './dto/actualizar_usuario.dto';
import * as bcrypt from 'bcrypt';

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
        try {
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
        } catch (error) {
            console.error('Error obteniendo usuarios con roles:', error);
            throw new InternalServerErrorException('Ocurrió un error al obtener los usuarios');
        }
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

    async actualizarUsuarioCompleto(id: number, dto: ActualizarUsuarioCompletoDto): Promise<any> {
        const usuario = await this.usuarioRepo.findOne({ where: { id } });

        if (!usuario) {
            throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
        }

        // Usuario
        if (dto.nombre) usuario.nombre = dto.nombre;
        if (dto.correo) usuario.correo = dto.correo;
        if (dto.contraseña) usuario.contraseña = await bcrypt.hash(dto.contraseña, 10);
        await this.usuarioRepo.save(usuario);

        // Estudiante
        const estudiante = await this.estudianteRepo.findOne({ where: { id } });
        if (estudiante) {
            if (dto.cedula) estudiante.cedula = dto.cedula;
            if (dto.carrera) estudiante.carrera = dto.carrera;
            if (dto.semestre) estudiante.semestre = dto.semestre;
            if (dto.telefono) estudiante.telefono = dto.telefono;
            await this.estudianteRepo.save(estudiante);
            return { usuario, estudiante };
        }

        // Coordinador
        const coordinador = await this.coordinadorRepo.findOne({ where: { id } });
        if (coordinador) {
            if (dto.cedula) coordinador.cedula = dto.cedula;
            if (dto.departamento) coordinador.departamento = dto.departamento;
            if (dto.extension_interna) coordinador.extension_interna = dto.extension_interna;
            await this.coordinadorRepo.save(coordinador);
            return { usuario, coordinador };
        }

        // Tutor
        const tutor = await this.tutorRepo.findOne({ where: { id } });
        if (tutor) {
            if (dto.cedula) tutor.cedula = dto.cedula;
            if (dto.profesion) tutor.profesion = dto.profesion;
            if (dto.experiencia) tutor.experiencia = dto.experiencia;
            if (dto.telefono) tutor.telefono = dto.telefono;
            await this.tutorRepo.save(tutor);
            return { usuario, tutor };
        }

        return { usuario };
    }
}
