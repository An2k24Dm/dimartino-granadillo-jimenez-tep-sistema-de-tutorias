import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    ParseIntPipe,
    HttpCode,
    HttpStatus,
    ForbiddenException,
    UseGuards,
} from '@nestjs/common';
import { CalificacionService } from './calificacion.service';
import { CreateCalificacionDto } from './dto/asignar_calificacion.dto';
import { UpdateCalificacionDto } from './dto/modificar_calificacion.dto';
import { User } from 'src/common/decorators/usuario.decorator';
import { RolFlexibleGuard } from 'src/common/guards/rol_flexible.guard';
import { AllowedRoles } from 'src/common/decorators/roles_permitidos.decorator';
import { JwtAuthGuard } from '../auth/jwt_auth.guard'; 

@Controller('calificacion')
export class CalificacionController {
    constructor(private readonly calificacionService: CalificacionService) {}

    /**
     * Endpoint para crear una nueva calificación.
     * POST /calificaciones
     */
    @UseGuards(JwtAuthGuard, RolFlexibleGuard) 
    @AllowedRoles('estudiante') 
    @Post('calificar')
    async createCalificaion(
        @Body() createCalificacionDto: CreateCalificacionDto,
        @User() usuarioPayload: { userId: number; rol: string }, 
    )   {
            const estudianteId = usuarioPayload.userId; 
            return this.calificacionService.createCalificacion(
                createCalificacionDto,
                estudianteId,
            );
        }

    @UseGuards(JwtAuthGuard, RolFlexibleGuard) 
    @AllowedRoles('coordinador') 
    @Patch(':id')
    // Aquí también podrías añadir un @UseGuards(JwtAuthGuard) si la ruta es protegida
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateCalificacionDto: UpdateCalificacionDto,
    ) {
        return this.calificacionService.update(id, updateCalificacionDto);
    }

}