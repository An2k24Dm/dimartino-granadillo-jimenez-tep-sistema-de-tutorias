import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Materia } from './materia.entity';
import { MateriaService } from './materia.service';
import { MateriaController } from './materia.controller';
import { Usuario } from '../usuario/usuario.entity';
import { Tutor } from '../tutor/tutor.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Materia, Usuario, Tutor]),
    AuthModule
  ],
  providers: [MateriaService],
  controllers: [MateriaController],
  exports: [MateriaService],
})
export class MateriaModule {}
