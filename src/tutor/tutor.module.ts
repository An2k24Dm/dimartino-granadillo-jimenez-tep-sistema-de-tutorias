import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tutor } from './tutor.entity';
import { TutorService } from './tutor.service';
import { TutorController } from './tutor.controller';
import { Usuario } from '../usuario/usuario.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Tutor, Usuario]),
    AuthModule,
  ],
  providers: [TutorService],
  controllers: [TutorController],
  exports: [TutorService],
})
export class TutorModule {}
