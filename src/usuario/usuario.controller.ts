import { Controller, Get, Delete, Param, ParseIntPipe, BadRequestException } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { Usuario } from './usuario.entity';

@Controller('usuario')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

    @Get()
    async obtenerTodos(): Promise<Usuario[]> {
        return this.usuarioService.encontrarTodos();
    }

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
