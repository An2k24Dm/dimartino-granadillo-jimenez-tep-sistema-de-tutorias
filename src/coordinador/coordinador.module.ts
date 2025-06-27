import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Coordinador } from './coordinador.entity';
import { CoordinadorService } from './coordinador.service';
import { CoordinadorController } from './coordinador.controller';
import { Usuario } from '../usuario/usuario.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Coordinador, Usuario])],
  providers: [CoordinadorService],
  controllers: [CoordinadorController],
  exports: [CoordinadorService],
})
export class CoordinadorModule {}
