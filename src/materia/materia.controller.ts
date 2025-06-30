import { Controller, Get, Delete, Param, ParseIntPipe, BadRequestException, UseGuards, Put, Body, UsePipes, ValidationPipe, Post } from '@nestjs/common';
import { CrearMateriaDto } from './dto/crear_materia.dto';
import { MateriaService } from './materia.service';
import { RolesGuard } from '../common/guards/roles.guard';
import { Materia } from './materia.entity';
import { ActualizarMateriaDto } from './dto/actualizar_materia.dto';

@Controller('materia')
export class MateriaController {
    constructor(private readonly materiaService: MateriaService) {}

    @UseGuards(RolesGuard)
    @Get()
    async obtenerTodos(): Promise<Materia[]> {
        return this.materiaService.encontrarTodos();
    }

    @UseGuards(RolesGuard)
    @Delete(':id')
    async eliminar(
    @Param('id', new ParseIntPipe({ exceptionFactory: (error) => {
        return new BadRequestException('El ID debe ser un número entero válido');
    }})) id: number,
    ): Promise<{ mensaje: string }> {
        await this.materiaService.eliminarMateria(id);
    return { mensaje: `Materia con ID ${id} eliminada correctamente` };
    }

    @UseGuards(RolesGuard)
    @Post('crear')
    async crearMateria(
    @Body(new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
        stopAtFirstError: true,
    })) dto: CrearMateriaDto
    ) {
    const materia = await this.materiaService.crear(dto);
    return {
        mensaje: 'Materia creada exitosamente',
        materia,
    };
    }

    @UseGuards(RolesGuard)
    @Put(':id')
    async actualizarMateria(
        @Param('id', ParseIntPipe) id: number,
        @Body(new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
        stopAtFirstError: true,
        })) dto: ActualizarMateriaDto,
    ) {
        const materia = await this.materiaService.actualizar(id, dto);
        return {
            mensaje: 'Materia actualizada exitosamente',
            materia,
        };
    }
}
