import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Coordinador } from './coordinador.entity';
import { CrearCoordinadorDto } from './dto/crear_coordinador.dto';
import { Usuario } from '../usuario/usuario.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CoordinadorService {
  constructor(
    @InjectRepository(Coordinador)
    private readonly coordinadorRepo: Repository<Coordinador>,
    @InjectRepository(Usuario)
    private readonly usuarioRepo: Repository<Usuario>,
    private readonly dataSource: DataSource,
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
}
