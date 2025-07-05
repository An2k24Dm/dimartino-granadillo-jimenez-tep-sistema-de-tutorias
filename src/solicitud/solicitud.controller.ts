// solicitud.controller.ts
import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Patch,
  Param,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { SolicitudService } from './solicitud.service';
import { CrearSolicitudDto } from '../solicitud/dto/crear_solicitud.dto';
import { JwtAuthGuard } from '../auth/jwt_auth.guard'; 
import { RolFlexibleGuard } from '../common/guards/rol_flexible.guard';
import { AllowedRoles } from '../common/decorators/roles_permitidos.decorator';
import { User } from '../common/decorators/usuario.decorator';

@Controller('solicitud')
export class SolicitudController {
  constructor(private readonly solicitudService: SolicitudService) {}

  @UseGuards(JwtAuthGuard, RolFlexibleGuard) 
  @AllowedRoles('estudiante') 
  @Post('crear')
  async createSolicitud(
    @Body() crearSolicitudDto: CrearSolicitudDto,
    @User() usuarioPayload: { userId: number; rol: string }, 
  ) {
    const estudianteId = usuarioPayload.userId; 
    return this.solicitudService.createSolicitud(
      crearSolicitudDto,
      estudianteId,
    );
  }

  @UseGuards(JwtAuthGuard, RolFlexibleGuard) 
  @AllowedRoles('tutor') 
  @Get('tutor')
  async getSolicitudesAsignadasTutor(
    @User() usuarioPayload: { userId: number; rol: string }, 
  ) {
    const tutorId = usuarioPayload.userId; 
    return this.solicitudService.findSolicitudesAsignadasTutor(tutorId);
  }

  @UseGuards(JwtAuthGuard, RolFlexibleGuard) 
  @AllowedRoles('tutor') 
  @Patch(':id/aceptar')
  async aceptarSolicitud(
    @Param('id') id: string,
    @User() usuarioPayload: { userId: number; rol: string }, 
  ) {
    const tutorId = usuarioPayload.userId; 
    return this.solicitudService.aceptarSolicitud(+id, tutorId);
  }

  @UseGuards(JwtAuthGuard, RolFlexibleGuard) 
  @AllowedRoles('tutor') 
  @Patch(':id/rechazar')
  async rechazarSolicitud(
    @Param('id') id: string,
    @User() usuarioPayload: { userId: number; rol: string }, 
  ) {
    const tutorId = usuarioPayload.userId; 
    return this.solicitudService.rechazarSolicitud(+id, tutorId);
  }
}