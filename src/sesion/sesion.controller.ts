import { Controller, Get, UseGuards, Patch, Param, ParseIntPipe, Query } from '@nestjs/common';
import { SesionService } from './sesion.service';
import { RolFlexibleGuard } from '../common/guards/rol_flexible.guard';
import { AllowedRoles } from '../common/decorators/roles_permitidos.decorator';
import { User } from '../common/decorators/usuario.decorator';

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
    @Get('visualizar')
    async listarTodasSesiones(
    @Query('limit') limit = 10,
    @Query('offset') offset = 0,
    ) {
        const limitNum = Number(limit);
        const offsetNum = Number(offset);
        return this.sesionService.listarTodasSesiones(limitNum, offsetNum);
    }

    @Get('filtrar')
    async filtrarSesiones(
    @Query('tutorId') tutorId?: number,
    @Query('materiaId') materiaId?: number,
    @Query('fechaSesion') fechaSesion?: string,
    @Query('estadoSesion') estadoSesionStr?: string,
    @Query('limit') limit = 10,
    @Query('offset') offset = 0,
    ) {
        const estadoSesion = estadoSesionStr !== undefined ? estadoSesionStr === 'true' : undefined;
        return this.sesionService.filtrarSesiones(
            tutorId ? Number(tutorId) : undefined,
            materiaId ? Number(materiaId) : undefined,
            fechaSesion,
            estadoSesion,
            Number(limit),
            Number(offset),
        );
    }

    @Get('estadisticas/tutores')
        async estadisticasPorTutor() {
        return this.sesionService.estadisticasSesionesPorTutor();
    }

    @Get('estadisticas/materias')
        async estadisticasPorMateria() {
        return this.sesionService.estadisticasSesionesPorMateria();
    }
}
