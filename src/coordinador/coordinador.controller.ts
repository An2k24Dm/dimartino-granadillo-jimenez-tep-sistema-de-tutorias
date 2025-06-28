import { Get, Controller, Post, Body, ValidationPipe, UseGuards } from '@nestjs/common';
import { CoordinadorService } from './coordinador.service';
import { CrearCoordinadorDto } from './dto/crear_coordinador.dto';
import { JwtAuthGuard } from '../auth/jwt_auth.guard';
import { User } from '../common/decorators/usuario.decorator';

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

  @UseGuards(JwtAuthGuard) //Protege el endpoint con el Token que genera JWT, es decir, requiere el token para poder acceder al endpoint
  @Get('perfil')
  async obtenerPerfil(@User() usuarioPayload: { userId: number; rol: string }) {
    console.log(usuarioPayload);
    return this.coordinadorService.obtenerPerfil(usuarioPayload.userId);
  }
}
