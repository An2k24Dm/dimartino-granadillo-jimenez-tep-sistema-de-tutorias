import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Estudiante } from './estudiante.entity';
import { CrearEstudianteDto } from './dto/crear_estudiante.dto';
import { Usuario } from '../usuario/usuario.entity';
import * as bcrypt from 'bcrypt';
import { DataSource } from 'typeorm'; // Asegúrate de inyectarlo si quieres usar transacciones

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
}