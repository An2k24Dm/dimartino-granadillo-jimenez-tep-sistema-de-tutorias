import { Controller, Get, Delete, Param, ParseIntPipe } from '@nestjs/common';
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
    async eliminarUsuario(@Param('id', ParseIntPipe) id: number): Promise<{ mensaje: string }> {
        await this.usuarioService.eliminarUsuarioConRol(id);
        return { mensaje: `Usuario con ID ${id} eliminado correctamente` };
    }
}
