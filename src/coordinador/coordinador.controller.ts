import { Get, Controller, Post, Body, ValidationPipe, UseGuards, Put, BadRequestException } from '@nestjs/common';
import { CoordinadorService } from './coordinador.service';
import { CrearCoordinadorDto } from './dto/crear_coordinador.dto';
import { JwtAuthGuard } from '../auth/jwt_auth.guard';
import { User } from '../common/decorators/usuario.decorator';
import { ActualizarPerfilCoordinadorDto } from '../coordinador/dto/actualizar_coordinador.dto';
import { RolFlexibleGuard } from '../common/guards/rol_flexible.guard';
import { AllowedRoles } from '../common/decorators/roles_permitidos.decorator';

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

  @UseGuards(RolFlexibleGuard)
  @AllowedRoles('coordinador')
  @Put('perfil')
  async actualizarPerfilCoordinador(
    @User() usuarioPayload: { userId: number; rol: string },
    @Body(new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      stopAtFirstError: true,
    })) dto: ActualizarPerfilCoordinadorDto,
  ) {
    if (!dto || Object.keys(dto).length === 0) {
      throw new BadRequestException('No se enviaron datos para actualizar');
    }
    const usuarioId = usuarioPayload.userId;
    const datos = await this.coordinadorService.actualizarPerfilCoordinador(usuarioId, dto);
    return {
      mensaje: 'Perfil actualizado exitosamente',
      datos,
    };
  }
}
