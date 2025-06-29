import { ConflictException, Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Estudiante } from './estudiante.entity';
import { CrearEstudianteDto } from './dto/crear_estudiante.dto';
import { Usuario } from '../usuario/usuario.entity';
import * as bcrypt from 'bcrypt';
import { DataSource } from 'typeorm';
import { ActualizarPerfilEstudianteDto } from './dto/actualizar_perfil.dto';

@Injectable()
export class EstudianteService {
  constructor(
    @InjectRepository(Estudiante)
    private readonly estudianteRepo: Repository<Estudiante>,
    @InjectRepository(Usuario)
    private readonly usuarioRepo: Repository<Usuario>,
    private readonly dataSource: DataSource,
  ) {}

  async crear(dto: CrearEstudianteDto): Promise<Estudiante> {
    const existeCorreo = await this.usuarioRepo.findOne({ where: { correo: dto.correo } });
    if (existeCorreo) throw new ConflictException('El correo ya está registrado');

    const existeCedula = await this.estudianteRepo.findOne({ where: { cedula: dto.cedula } });
    if (existeCedula) throw new ConflictException('La cédula ya está registrada');

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const usuario = this.usuarioRepo.create({
        nombre: dto.nombre,
        correo: dto.correo,
        contraseña: await bcrypt.hash(dto.contraseña, 10),
      });
      const usuarioGuardado = await queryRunner.manager.save(usuario);

      const estudiante = this.estudianteRepo.create({
        id: usuarioGuardado.id,
        usuario: usuarioGuardado,
        cedula: dto.cedula,
        carrera: dto.carrera,
        semestre: dto.semestre,
        telefono: dto.telefono,
      });
      const estudianteGuardado = await queryRunner.manager.save(estudiante);

      await queryRunner.commitTransaction();
      return estudianteGuardado;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async obtenerPerfil(usuarioId: number): Promise<Estudiante> {
    const estudiante = await this.estudianteRepo.findOne({
      where: { id: usuarioId },
      relations: ['usuario'], // para traer datos del usuario asociado
    });

    if (!estudiante) {
      throw new NotFoundException('Token inválido. Estudiante no encontrado');
    }

    return estudiante;
  }

  async actualizarPerfilEstudiante(usuarioId: number, dto: ActualizarPerfilEstudianteDto): Promise<any> {
    try {
      const usuario = await this.usuarioRepo.findOne({ where: { id: usuarioId } }); // Buscar usuario
      if (!usuario) {
        throw new NotFoundException('Usuario no encontrado');
      }

      const estudiante = await this.estudianteRepo.findOne({ where: { id: usuarioId } }); // Buscar estudiante
      if (!estudiante) {
        throw new NotFoundException('Estudiante no encontrado');
      }

      // Campos de usuario
      if (dto.nombre) usuario.nombre = dto.nombre;
      if (dto.correo) usuario.correo = dto.correo;

      if (dto.contraseña) {
        usuario.contraseña = await bcrypt.hash(dto.contraseña, 10);
      }

      await this.usuarioRepo.save(usuario);

      // Campos de estudiante
      if (dto.cedula) estudiante.cedula = dto.cedula;
      if (dto.carrera) estudiante.carrera = dto.carrera;
      if (dto.semestre) estudiante.semestre = dto.semestre;
      if (dto.telefono) estudiante.telefono = dto.telefono;

      await this.estudianteRepo.save(estudiante);

      return {
        usuario: {
          id: usuario.id,
          nombre: usuario.nombre,
          correo: usuario.correo,
          activo: usuario.activo,
          fecha_creacion: usuario.fecha_creacion,
        },
        estudiante,
      };

    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      throw new InternalServerErrorException('Ocurrió un error al actualizar el perfil');
    }
  }
}