import { Controller, Post, Body, ValidationPipe, UseGuards, Get } from '@nestjs/common';
import { EstudianteService } from './estudiante.service';
import { CrearEstudianteDto } from './dto/crear_estudiante.dto';
import { JwtAuthGuard } from '../auth/jwt_auth.guard';
import { User } from '../common/decorators/usuario.decorator';


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

  @UseGuards(JwtAuthGuard) //Protege el endpoint con el Token que genera JWT, es decir, requiere el token para poder acceder al endpoint
  @Get('perfil')
  async obtenerPerfil(@User() usuarioPayload: { userId: number; rol: string }) {
    console.log(usuarioPayload);
    return this.estudianteService.obtenerPerfil(usuarioPayload.userId);
  }
}