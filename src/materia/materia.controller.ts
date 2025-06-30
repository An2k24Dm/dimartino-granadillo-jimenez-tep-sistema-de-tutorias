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
}
