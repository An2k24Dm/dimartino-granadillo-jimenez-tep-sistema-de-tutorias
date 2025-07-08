import { Controller, Get, UseGuards, Patch, Param, ParseIntPipe } from '@nestjs/common';
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
}
