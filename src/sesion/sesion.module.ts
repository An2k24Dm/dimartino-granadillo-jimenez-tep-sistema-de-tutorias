import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sesion } from './sesion.entity';
import { SesionService } from './sesion.service';
import { SesionController } from './sesion.controller';
import { SolicitudModule } from '../solicitud/solicitud.module'; // si usas servicio de solicitud
import { AuthModule } from '../auth/auth.module';
import { Tutor } from 'src/tutor/tutor.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Sesion, Tutor]), SolicitudModule,AuthModule],
  controllers: [SesionController],
  providers: [SesionService],
})
export class SesionModule {}
