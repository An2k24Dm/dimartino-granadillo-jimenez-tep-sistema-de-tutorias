import { Get, Controller, Post, Body, UseGuards, ValidationPipe } from '@nestjs/common';
import { TutorService } from './tutor.service';
import { CrearTutorDto } from './dto/crear_tutor.dto';
import { JwtAuthGuard } from '../auth/jwt_auth.guard';
import { User } from '../common/decorators/usuario.decorator';

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

  @UseGuards(JwtAuthGuard) //Protege el endpoint con el Token que genera JWT, es decir, requiere el token para poder acceder al endpoint
  @Get('perfil')
  async obtenerPerfil(@User() usuarioPayload: { userId: number; rol: string }) {
    console.log(usuarioPayload);
    return this.tutorService.obtenerPerfil(usuarioPayload.userId);
  }
}