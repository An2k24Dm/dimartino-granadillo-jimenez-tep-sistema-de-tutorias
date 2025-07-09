import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioModule } from './usuario/usuario.module';
import { AuthModule } from './auth/auth.module';
import { EstudianteModule } from './estudiante/estudiante.module';
import { TutorModule } from './tutor/tutor.module';
import { CoordinadorModule } from './coordinador/coordinador.module';
import { MateriaModule } from './materia/materia.module';
import { SolicitudModule } from './solicitud/solicitud.module';
import { SesionModule } from './sesion/sesion.module';
import { CalificacionModule } from './calificaciones/calificacion.module';
import { LogModule } from './log/log.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import {DatabaseLoggingInterceptor} from './common/interceptors/logging.interceptor'

@Module({
  imports: [
    ConfigModule.forRoot({ //Esto activa el soporte para variables de entorno (.env) en NestJs
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT!),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      //Solo en desarrollo, esto verifica si hay tablas nuevas por crear o modificar y cuando se hace npm start se modifica o se crean
      //De lo contrario se coloca en false
      synchronize: true, 
    }),
    UsuarioModule,
    AuthModule,
    EstudianteModule,
    TutorModule,
    CoordinadorModule,
    MateriaModule,
    SolicitudModule,
    SesionModule,
    CalificacionModule,
    LogModule,
  ],
  controllers: [AppController],
  providers: [AppService, 
    {
      provide: APP_INTERCEPTOR,
      useClass: DatabaseLoggingInterceptor,
    },
  ],
})
export class AppModule {}
