import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Solicitud } from './solicitud.entity';
import { SolicitudService } from './solicitud.service';
import { SolicitudController } from './solicitud.controller';
import { Estudiante } from '../estudiante/estudiante.entity';
import { Tutor } from '../tutor/tutor.entity';
import { Materia } from '../materia/materia.entity';

@Module({
  imports: [
    // Importa las entidades que se usarán dentro de este módulo.
    // TypeORM creará los Repositories para ellas y podrán ser inyectados.
    TypeOrmModule.forFeature([
      Solicitud, 
      Estudiante, 
      Tutor, 
      Materia
    ]),
  ],
  // Declara los servicios que pertenecen a este módulo.
  providers: [SolicitudService],
  // Declara los controladores que manejarán las rutas de este módulo.
  controllers: [SolicitudController]
})
export class SolicitudModule {}