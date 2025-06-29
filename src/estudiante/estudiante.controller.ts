import { Controller, Post, Body, ValidationPipe, UseGuards, Get, BadRequestException, Put, Req } from '@nestjs/common';
import { EstudianteService } from './estudiante.service';
import { CrearEstudianteDto } from './dto/crear_estudiante.dto';
import { JwtAuthGuard } from '../auth/jwt_auth.guard';
import { User } from '../common/decorators/usuario.decorator';
import { ActualizarPerfilEstudianteDto } from './dto/actualizar_perfil.dto';
import { RolFlexibleGuard } from '../common/guards/rol_flexible.guard';
import { AllowedRoles } from '../common/decorators/roles_permitidos.decorator';

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

  @UseGuards(RolFlexibleGuard)
  @AllowedRoles('estudiante')
  @Put('perfil')
  async actualizarPerfilEstudiante(
    @User() usuarioPayload: { userId: number; rol: string },
    @Body(new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      stopAtFirstError: true,
    })) dto: ActualizarPerfilEstudianteDto,
  ) {
    if (!dto || Object.keys(dto).length === 0) {
      throw new BadRequestException('No se enviaron datos para actualizar');
    }

    const usuarioId = usuarioPayload.userId;
    console.log("CONTROLLER: ", usuarioId);
    
    const datos = await this.estudianteService.actualizarPerfilEstudiante(usuarioId, dto);
    return {
      mensaje: 'Perfil actualizado exitosamente',
      datos,
    };
  }
}