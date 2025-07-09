import { Controller, Get, UseGuards, Patch, Param, ParseIntPipe, Delete, HttpCode, Put, Body } from '@nestjs/common';
import { SesionService } from './sesion.service';
import { RolFlexibleGuard } from '../common/guards/rol_flexible.guard';
import { AllowedRoles } from '../common/decorators/roles_permitidos.decorator';
import { User } from '../common/decorators/usuario.decorator';
import { ActualizarSesionDto } from './dto/actualizar_sesion.dto';

@Controller('sesiones')
export class SesionController {
  constructor(private readonly sesionService: SesionService) {}

    @UseGuards(RolFlexibleGuard)
    @AllowedRoles('tutor')
    @Get()
    async listarSesionesPorTutor(@User() usuarioPayload: { userId: number; rol: string }) {
        return this.sesionService.listarSesionesPorTutor(usuarioPayload.userId);
    }

    @UseGuards(RolFlexibleGuard)
    @AllowedRoles('tutor')
    @Patch(':id/completar')
    async marcarSesionCompletada(
        @Param('id', ParseIntPipe) sesionId: number,
        @User() usuarioPayload: { userId: number; rol: string },
    ) {
        return this.sesionService.marcarSesionCompletada(sesionId, usuarioPayload.userId);
    }

    @UseGuards(RolFlexibleGuard)
    @AllowedRoles('coordinador')
    @Delete(':id')
    @HttpCode(200)
    async eliminarSesion(@Param('id', ParseIntPipe) sesionId: number) {
    await this.sesionService.eliminarSesion(sesionId);
    return { message: 'Sesión eliminada correctamente.' };
    }

    @UseGuards(RolFlexibleGuard)
    @AllowedRoles('coordinador')
    @Put(':id')
    async actualizarSesion(
        @Param('id', ParseIntPipe) sesionId: number,
        @Body() dto: ActualizarSesionDto,
    ) {
        const sesionActualizada = await this.sesionService.actualizarSesion(sesionId, dto);
        return {
        message: 'Sesión actualizada correctamente.',
        sesion: sesionActualizada,
        };
    }
}
