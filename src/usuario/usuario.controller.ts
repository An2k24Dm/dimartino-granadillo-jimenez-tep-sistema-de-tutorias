import { Controller, Get, Delete, Param, ParseIntPipe, BadRequestException, UseGuards } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { Usuario } from './usuario.entity';
import { RolesGuard } from '../common/guards/roles.guard';

@Controller('usuario')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

    @UseGuards(RolesGuard)
    @Get()
    async obtenerTodos(): Promise<Usuario[]> {
        return this.usuarioService.encontrarTodos();
    }

    @UseGuards(RolesGuard)
    @Delete(':id')
    async eliminar(
    @Param('id', new ParseIntPipe({ exceptionFactory: (error) => {
        return new BadRequestException('El ID debe ser un número entero válido');
    }})) id: number,
    ): Promise<{ mensaje: string }> {
        await this.usuarioService.eliminarUsuarioConRol(id);
    return { mensaje: `Usuario con ID ${id} eliminados correctamente` };
    }
}
