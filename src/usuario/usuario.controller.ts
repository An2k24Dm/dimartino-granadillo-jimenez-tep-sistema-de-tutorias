import { Controller, Get, Delete, Param, ParseIntPipe, BadRequestException, UseGuards, Put, Body, UsePipes, ValidationPipe } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { Usuario } from './usuario.entity';
import { RolesGuard } from '../common/guards/roles.guard';
import { ActualizarUsuarioCompletoDto } from '../usuario/dto/actualizar_usuario.dto';

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

    @Put(':id')
    @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }))
    async actualizarCompleto(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: ActualizarUsuarioCompletoDto,
    ) {
        if (!dto || Object.keys(dto).length === 0) {
            throw new BadRequestException('No se enviaron datos para actualizar');
        }
        const datos = await this.usuarioService.actualizarUsuarioCompleto(id, dto);
        return {
            mensaje: 'Usuario y datos de rol actualizados exitosamente',
            datos,
        };
    }
}
