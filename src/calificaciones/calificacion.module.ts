import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Calificacion } from './calificacion.entity';
import { CalificacionService } from './calificacion.service';
import { CalificacionController } from './calificacion.controller';
import { Estudiante } from '../estudiante/estudiante.entity';
import { Tutor } from '../tutor/tutor.entity';
import { Sesion } from '../sesion/sesion.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    AuthModule,
    // Importa la entidad 'Calificacion' y todas las entidades
    // con las que se relaciona para que sus repositorios
    // estén disponibles para inyección en el servicio.
    TypeOrmModule.forFeature([
      Calificacion,
      Estudiante,
      Tutor,
      Sesion
    ]),
  ],
  // Declara los servicios que pertenecen a este módulo.
  providers: [CalificacionService],
  // Declara los controladores que manejarán las rutas de este módulo.
  controllers: [CalificacionController],
})
export class CalificacionModule {}