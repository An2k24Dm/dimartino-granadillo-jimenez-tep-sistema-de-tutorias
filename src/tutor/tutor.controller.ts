import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { TutorService } from './tutor.service';
import { CrearTutorDto } from './dto/crear_tutor.dto';

@Controller('tutor')
export class TutorController {
  constructor(private readonly tutorService: TutorService) {}

  @Post('registro')
  async registrar(
    @Body(new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      stopAtFirstError: true
    })) dto: CrearTutorDto
  ) {
    return this.tutorService.crear(dto);
  }
}