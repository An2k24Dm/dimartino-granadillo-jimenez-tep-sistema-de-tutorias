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
} from '@nestjs/common';
import { SolicitudService } from './solicitud.service';
import { CrearSolicitudDto } from '../solicitud/dto/crear_solicitud.dto';
import { JwtAuthGuard } from '../auth/jwt_auth.guard'; 
import { RolFlexibleGuard } from '../common/guards/rol_flexible.guard';
import { AllowedRoles } from '../common/decorators/roles_permitidos.decorator';
import { User } from '../common/decorators/usuario.decorator';
import { ActualizarSolicitudDto } from './dto/actualizar_solicitud.dto';

/**
 * Define las rutas de la API bajo el prefijo /solicitudes.
 * Por ejemplo: GET /solicitudes, POST /solicitudes, GET /solicitudes/1
 */
@Controller('solicitudes')
export class SolicitudController {
    constructor(private readonly solicitudService: SolicitudService) {}

    /**
     * Endpoint para obtener todas las solicitudes.
     * GET /solicitudes
     */
    @UseGuards(RolFlexibleGuard)
    @AllowedRoles('coordinador')
    @Get('listar')
    findAll() {
        return this.solicitudService.findAll();
    }

    /**
     * Endpoint para obtener una solicitud por su ID.
     * GET /solicitudes/:id
     */
    @UseGuards(RolFlexibleGuard)
    @AllowedRoles('coordinador')
    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        // El decorador @Param('id') extrae el ID de la URL.
        // ParseIntPipe convierte el ID de string a número y valida que sea un entero.
        return this.solicitudService.findOne(id);
    }

    @UseGuards(RolFlexibleGuard)
    @AllowedRoles('coordinador')
    @Put(':id')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() actualizarSolicitudDto: ActualizarSolicitudDto,
    ) {
        return this.solicitudService.update(id, actualizarSolicitudDto);
    }

    /**
     * Endpoint para eliminar una solicitud por su ID.
     * DELETE /solicitudes/:id
     */

    @UseGuards(RolFlexibleGuard)
    @AllowedRoles('coordinador')
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT) // Devuelve un código 204 en lugar de 200 en caso de éxito.
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.solicitudService.remove(id);
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