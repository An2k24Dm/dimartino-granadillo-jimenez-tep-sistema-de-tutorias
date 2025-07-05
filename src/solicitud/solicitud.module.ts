import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Solicitud } from './solicitud.entity';
import { SolicitudService } from './solicitud.service';
import { SolicitudController } from './solicitud.controller';
import { Estudiante } from '../estudiante/estudiante.entity';
import { Tutor } from '../tutor/tutor.entity';
import { Materia } from '../materia/materia.entity';
import { Sesion } from '../sesion/sesion.entity';
import { AuthModule } from '../auth/auth.module'; // Importa el módulo de autenticación

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([
      Solicitud, 
      Estudiante, 
      Tutor, 
      Materia,
      Sesion
    ]),
  ],
  providers: [SolicitudService],
  controllers: [SolicitudController],
  exports: [SolicitudService], 
})
export class SolicitudModule {}
