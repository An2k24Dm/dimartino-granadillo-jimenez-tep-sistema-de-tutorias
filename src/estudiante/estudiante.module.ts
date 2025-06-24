import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Estudiante } from './estudiante.entity';
import { EstudianteService } from './estudiante.service';
import { EstudianteController } from './estudiante.controller';
import { Usuario } from '../usuario/usuario.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Estudiante, Usuario])],
  controllers: [EstudianteController],
  providers: [EstudianteService],
  exports: [EstudianteService],
})
export class EstudianteModule {}
