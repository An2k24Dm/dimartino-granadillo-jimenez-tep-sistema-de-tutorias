import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Coordinador } from './coordinador.entity';
import { CoordinadorService } from './coordinador.service';
import { CoordinadorController } from './coordinador.controller';
import { Usuario } from '../usuario/usuario.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Coordinador, Usuario]),
    AuthModule
  ],
  providers: [CoordinadorService],
  controllers: [CoordinadorController],
  exports: [CoordinadorService],
})
export class CoordinadorModule {}
