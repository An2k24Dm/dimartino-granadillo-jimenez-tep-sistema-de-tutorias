import { ConflictException, Injectable, NotFoundException, InternalServerErrorException, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Coordinador } from './coordinador.entity';
import { CrearCoordinadorDto } from './dto/crear_coordinador.dto';
import { Usuario } from '../usuario/usuario.entity';
import * as bcrypt from 'bcrypt';
import { ActualizarPerfilCoordinadorDto } from '../coordinador/dto/actualizar_coordinador.dto';
import { AsignarMateriaTutorDto } from '../coordinador/dto/asignar_materia.dto';
import { Tutor } from '../tutor/tutor.entity';
import { Materia } from '../materia/materia.entity';

@Injectable()
export class CoordinadorService {
  constructor(
    @InjectRepository(Coordinador)
    private readonly coordinadorRepo: Repository<Coordinador>,
    @InjectRepository(Usuario)
    private readonly usuarioRepo: Repository<Usuario>,
    private readonly dataSource: DataSource,
    @InjectRepository(Tutor)
    private readonly tutorRepo: Repository<Tutor>,
    @InjectRepository(Materia)
    private readonly materiaRepo: Repository<Materia>,
  ) {}

  async crear(dto: CrearCoordinadorDto): Promise<Coordinador> {
    const existeCorreo = await this.usuarioRepo.findOne({ where: { correo: dto.correo } });
    if (existeCorreo) throw new ConflictException('El correo ya está registrado');

    const existeCedula = await this.coordinadorRepo.findOne({ where: { cedula: dto.cedula } });
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

      const coordinador = this.coordinadorRepo.create({
        id: usuarioGuardado.id,
        usuario: usuarioGuardado,
        cedula: dto.cedula,
        departamento: dto.departamento,
        extension_interna: dto.extension_interna,
      });
      const coordinadorGuardado = await queryRunner.manager.save(coordinador);

      await queryRunner.commitTransaction();
      return coordinadorGuardado;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async obtenerPerfil(usuarioId: number): Promise<Coordinador> {
    const estudiante = await this.coordinadorRepo.findOne({
      where: { id: usuarioId },
      relations: ['usuario'], // para traer datos del usuario asociado
    });

    if (!estudiante) {
      throw new NotFoundException('Token inválido. Tutor no encontrado');
    }

    return estudiante;
  }

  async actualizarPerfilCoordinador(usuarioId: number, dto: ActualizarPerfilCoordinadorDto): Promise<any> {
    try {
      const usuario = await this.usuarioRepo.findOne({ where: { id: usuarioId } });
      if (!usuario) {
        throw new NotFoundException('Usuario no encontrado');
      }

      const coordinador = await this.coordinadorRepo.findOne({ where: { id: usuarioId } });
      if (!coordinador) {
        throw new NotFoundException('Coordinador no encontrado');
      }

      if (dto.nombre) usuario.nombre = dto.nombre;
      if (dto.correo) usuario.correo = dto.correo;
      if (dto.contraseña) {
        usuario.contraseña = await bcrypt.hash(dto.contraseña, 10);
      }

      await this.usuarioRepo.save(usuario);

      if (dto.cedula) coordinador.cedula = dto.cedula;
      if (dto.departamento) coordinador.departamento = dto.departamento;
      if (dto.extension_interna) coordinador.extension_interna = dto.extension_interna;

      await this.coordinadorRepo.save(coordinador);

      return {
        usuario: {
          id: usuario.id,
          nombre: usuario.nombre,
          correo: usuario.correo,
          contraseña: usuario.contraseña,
          activo: usuario.activo,
          fecha_creacion: usuario.fecha_creacion,
        },
        coordinador,
      };
    } catch (error) {
      console.error('Error al actualizar perfil coordinador:', error);
      throw new InternalServerErrorException('Ocurrió un error al actualizar el perfil');
    }
  }

  async asignarMateriaATutor(dto: AsignarMateriaTutorDto): Promise<any> {
    try {
      const tutor = await this.tutorRepo.findOne({ where: { cedula: dto.cedula }, relations: ['materia', 'usuario'] });
      if (!tutor) {
        throw new NotFoundException('Tutor no encontrado. Verifique que la cedula le pertenezca a un Tutor.');
      }

      if (tutor.materia) {
        throw new ConflictException('El tutor ya tiene una materia asignada');
      }

      const materia = await this.materiaRepo.findOne({ where: { codigo: dto.codigoMateria } });
      if (!materia) {
        throw new NotFoundException('Materia no encontrada con el código proporcionado');
      }

      if (tutor.materia && (tutor.materia as Materia).id === materia.id) {
        throw new ConflictException('El tutor ya tiene asignada esta materia');
      }

      tutor.materia = materia;
      await this.tutorRepo.save(tutor);
      return {
        mensaje: `Materia "${materia.nombre}" asignada exitosamente al tutor "${tutor.usuario.nombre}"`,
        tutor: {
          id: tutor.id,
          nombre: tutor.usuario.nombre,
          cedula: tutor.cedula,
          materia: {
            id: materia.id,
            nombre: materia.nombre,
            codigo: materia.codigo,
          },
        },
      };
    } catch (error) {
      console.error('Error al asignar materia:', error);
      // Si ya es una excepción controlada (NotFoundException, ConflictException, etc.), la relanzamos tal cual
      if (error instanceof HttpException) {
        throw error;
      }
      // Si es otro error inesperado, devolvemos error 500
      throw new InternalServerErrorException('Ocurrió un error al asignar la materia');
    }
  }
}
