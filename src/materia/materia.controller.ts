import { Controller, Get, Delete, Param, ParseIntPipe, BadRequestException, UseGuards, Put, Body, UsePipes, ValidationPipe } from '@nestjs/common';
import { MateriaService } from './materia.service';
import { RolesGuard } from '../common/guards/roles.guard';
import { Materia } from './materia.entity';

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
}
