import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Tutor } from './tutor.entity';
import { CrearTutorDto } from './dto/crear_tutor.dto';
import { Usuario } from '../usuario/usuario.entity';
import * as bcrypt from 'bcrypt';

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
      throw new NotFoundException('Tutor no encontrado');
    }

    return estudiante;
  }
}
