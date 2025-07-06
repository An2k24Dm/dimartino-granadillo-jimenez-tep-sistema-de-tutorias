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
  ParseIntPipe,
  Put,
  Delete,
  HttpCode,
  HttpStatus,
  ValidationPipe,
} from '@nestjs/common';
import { SolicitudService } from './solicitud.service';
import { CrearSolicitudDto } from '../solicitud/dto/crear_solicitud.dto';
import { JwtAuthGuard } from '../auth/jwt_auth.guard'; 
import { RolFlexibleGuard } from '../common/guards/rol_flexible.guard';
import { AllowedRoles } from '../common/decorators/roles_permitidos.decorator';
import { User } from '../common/decorators/usuario.decorator';
import { ActualizarSolicitudDto } from './dto/actualizar_solicitud.dto';

@Controller('solicitud')
export class SolicitudController {
  constructor(private readonly solicitudService: SolicitudService) {}

  @UseGuards(RolFlexibleGuard) 
  @AllowedRoles('tutor') 
  @Get('tutor')
  async getSolicitudesAsignadasTutor(
    @User() usuarioPayload: { userId: number; rol: string }, 
  ) {
    console.log('Payload del usuario:', usuarioPayload);
    const tutorId = usuarioPayload.userId; 
    return this.solicitudService.findSolicitudesAsignadasTutor(tutorId);
  }

  @UseGuards(RolFlexibleGuard)
  @AllowedRoles('coordinador')
  @Get('listar')
  findAll() {
      return this.solicitudService.findAll();
  }

  @UseGuards(RolFlexibleGuard)
  @AllowedRoles('coordinador')
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
      return this.solicitudService.findOne(id);
  }

  @UseGuards(RolFlexibleGuard)
  @AllowedRoles('coordinador')
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })) actualizarSolicitudDto: ActualizarSolicitudDto,
  ) {
    return this.solicitudService.update(id, actualizarSolicitudDto);
  }

  @UseGuards(RolFlexibleGuard)
  @AllowedRoles('coordinador')
  @Delete(':id')
  @HttpCode(HttpStatus.OK) // Cambiado a 200 para devolver cuerpo
  async remove(@Param('id', ParseIntPipe) id: number) {
      await this.solicitudService.remove(id);
      return { message: 'Solicitud eliminada correctamente.' };
  }

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