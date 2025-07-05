import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Solicitud } from './solicitud.entity';
import { SolicitudService } from './solicitud.service';
import { SolicitudController } from './solicitud.controller';
import { AuthModule } from 'src/auth/auth.module';
import { Estudiante } from 'src/estudiante/estudiante.entity';
import { Tutor } from 'src/tutor/tutor.entity';
import { Materia } from 'src/materia/materia.entity';
import { Sesion } from 'src/sesion/sesion.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Solicitud,Estudiante,Tutor,Materia,Sesion]),AuthModule],
  controllers: [SolicitudController],
  providers: [SolicitudService],
  exports: [SolicitudService], // por si se usa en otros módulos
})
export class SolicitudModule {}
