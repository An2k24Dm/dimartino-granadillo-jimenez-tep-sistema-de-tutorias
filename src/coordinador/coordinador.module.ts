import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Coordinador } from './coordinador.entity';
import { CoordinadorService } from './coordinador.service';
import { CoordinadorController } from './coordinador.controller';
import { Usuario } from '../usuario/usuario.entity';
import { AuthModule } from '../auth/auth.module';
import { Materia } from '../materia/materia.entity'
import { Tutor } from '../tutor/tutor.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([Coordinador, Usuario, Materia, Tutor]),
    AuthModule
  ],
  providers: [CoordinadorService],
  controllers: [CoordinadorController],
  exports: [CoordinadorService],
})
export class CoordinadorModule {}
