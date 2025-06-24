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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
