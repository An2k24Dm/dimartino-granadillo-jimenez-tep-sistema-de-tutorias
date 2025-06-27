import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { EstudianteService } from './estudiante.service';
import { CrearEstudianteDto } from './dto/crear_estudiante.dto';

@Controller('estudiante')
export class EstudianteController {
  constructor(private readonly estudianteService: EstudianteService) {}

  @Post('registro')
  async registrar(
    @Body(new ValidationPipe({ 
        transform: true, 
        transformOptions: { enableImplicitConversion: true }, 
        stopAtFirstError: true  
    })) dto: CrearEstudianteDto
  ) {
    return this.estudianteService.crear(dto);
  }
}