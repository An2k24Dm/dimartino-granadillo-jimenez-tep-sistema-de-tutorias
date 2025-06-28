import { Module } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { UsuarioController } from './usuario.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from './usuario.entity';
import { Estudiante } from '../estudiante/estudiante.entity';
import { Coordinador } from '../coordinador/coordinador.entity';
import { Tutor } from '../tutor/tutor.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Usuario, Estudiante, Coordinador, Tutor])],
  providers: [UsuarioService], // Registra el servicio dentro del módulo actual (UsuarioModule), para que pueda ser usado dentro del mismo módulo.
  controllers: [UsuarioController], // Le dice a NestJS que use este controlador para este modulo
  exports: [UsuarioService], //  Hace que ese servicio esté disponible para otros módulos que importen UsuarioModule.
})
export class UsuarioModule {}
