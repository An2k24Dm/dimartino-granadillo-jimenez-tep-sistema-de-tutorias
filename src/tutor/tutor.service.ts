import { ConflictException, Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Tutor } from './tutor.entity';
import { CrearTutorDto } from './dto/crear_tutor.dto';
import { Usuario } from '../usuario/usuario.entity';
import * as bcrypt from 'bcrypt';
import { ActualizarPerfilTutorDto } from '../tutor/dto/actualizar_perfil.dto';

@Injectable()
export class TutorService {
  constructor(
    @InjectRepository(Tutor)
    private readonly tutorRepo: Repository<Tutor>,
    @InjectRepository(Usuario)
    private readonly usuarioRepo: Repository<Usuario>,
    private readonly dataSource: DataSource,
  ) {}

  async crear(dto: CrearTutorDto): Promise<Tutor> {
    const existeCorreo = await this.usuarioRepo.findOne({ where: { correo: dto.correo } });
    if (existeCorreo) throw new ConflictException('El correo ya está registrado');

    const existeCedula = await this.tutorRepo.findOne({ where: { cedula: dto.cedula } });
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

      const tutor = this.tutorRepo.create({
        id: usuarioGuardado.id,
        usuario: usuarioGuardado,
        cedula: dto.cedula,
        profesion: dto.profesion,
        experiencia: dto.experiencia,
        telefono: dto.telefono,
      });
      const tutorGuardado = await queryRunner.manager.save(tutor);

      await queryRunner.commitTransaction();
      return tutorGuardado;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async obtenerPerfil(usuarioId: number): Promise<Tutor> {
    const estudiante = await this.tutorRepo.findOne({
      where: { id: usuarioId },
      relations: ['usuario'], // para traer datos del usuario asociado
    });

    if (!estudiante) {
      throw new NotFoundException('Token inválido. Tutor no encontrado');
    }

    return estudiante;
  }

  async actualizarPerfilTutor(usuarioId: number, dto: ActualizarPerfilTutorDto): Promise<any> {
    try {
      const usuario = await this.usuarioRepo.findOne({ where: { id: usuarioId } });
      if (!usuario) {
        throw new NotFoundException('Usuario no encontrado');
      }
      
      const tutor = await this.tutorRepo.findOne({ where: { id: usuarioId } });
      if (!tutor) {
        throw new NotFoundException('Tutor no encontrado');
      }

      if (dto.nombre) usuario.nombre = dto.nombre;
      if (dto.contraseña) {
        usuario.contraseña = await bcrypt.hash(dto.contraseña, 10);
      }

      await this.usuarioRepo.save(usuario);

      if (dto.cedula) tutor.cedula = dto.cedula;
      if (dto.profesion) tutor.profesion = dto.profesion;
      if (dto.experiencia) tutor.experiencia = dto.experiencia;
      if (dto.telefono) tutor.telefono = dto.telefono;

      await this.tutorRepo.save(tutor);

      return {
        usuario: {
          id: usuario.id,
          nombre: usuario.nombre,
          correo: usuario.correo,
          contraseña: usuario.contraseña,
          activo: usuario.activo,
          fecha_creacion: usuario.fecha_creacion,
        },
        tutor,
      };
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      throw new InternalServerErrorException('Ocurrió un error al actualizar el perfil');
    }
  }
}
