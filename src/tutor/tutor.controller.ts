import { Get, Controller, Post, Body, UseGuards, ValidationPipe, Put, BadRequestException } from '@nestjs/common';
import { TutorService } from './tutor.service';
import { CrearTutorDto } from './dto/crear_tutor.dto';
import { JwtAuthGuard } from '../auth/jwt_auth.guard';
import { User } from '../common/decorators/usuario.decorator';
import { RolFlexibleGuard } from '../common/guards/rol_flexible.guard';
import { AllowedRoles } from '../common/decorators/roles_permitidos.decorator';
import { ActualizarPerfilTutorDto } from '../tutor/dto/actualizar_perfil.dto';

@Controller('tutor')
export class TutorController {
  constructor(private readonly tutorService: TutorService) {}

  @UseGuards(RolFlexibleGuard)
  @AllowedRoles('coordinador')
  @Post('registrar')
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

  @UseGuards(RolFlexibleGuard)
  @AllowedRoles('tutor')
  @Put('perfil')
  async actualizarPerfilTutor(
    @User() usuarioPayload: { userId: number; rol: string },
    @Body(new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      stopAtFirstError: true,
    })) dto: ActualizarPerfilTutorDto,
  ) {
    if (!dto || Object.keys(dto).length === 0) {
      throw new BadRequestException('No se enviaron datos para actualizar');
    }
    const usuarioId = usuarioPayload.userId;
    const datos = await this.tutorService.actualizarPerfilTutor(usuarioId, dto);
    return {
      mensaje: 'Perfil actualizado exitosamente',
      datos,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('materia')
  async verMateria(@User() usuarioPayload: { userId: number; rol: string }) {
    return this.tutorService.verMateria(usuarioPayload.userId);
  }
}