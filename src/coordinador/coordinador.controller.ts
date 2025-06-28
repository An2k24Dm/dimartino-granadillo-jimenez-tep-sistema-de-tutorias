import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { CoordinadorService } from './coordinador.service';
import { CrearCoordinadorDto } from './dto/crear_coordinador.dto';

@Controller('coordinador')
export class CoordinadorController {
  constructor(private readonly coordinadorService: CoordinadorService) {}

  @Post('registro')
  async registrar(
    @Body(new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      stopAtFirstError: true
    })) dto: CrearCoordinadorDto
  ) {
    return this.coordinadorService.crear(dto);
  }
}
