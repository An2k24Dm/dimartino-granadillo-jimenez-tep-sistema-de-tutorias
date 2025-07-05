import {
    Controller,
    Get,
    Post,
    Body,
    Put,
    Param,
    Delete,
    ParseIntPipe,
    HttpCode,
    HttpStatus,
    UseGuards
} from '@nestjs/common';
import { SolicitudService } from './solicitud.service';
import { CrearSolicitudDto } from './dto/crear_solicitud.dto';
import { ActualizarSolicitudDto } from './dto/actualizar_solicitud.dto';
import { RolesGuard } from '../common/guards/roles.guard';

/**
 * Define las rutas de la API bajo el prefijo /solicitudes.
 * Por ejemplo: GET /solicitudes, POST /solicitudes, GET /solicitudes/1
 */
@Controller('solicitudes')
export class SolicitudController {
    constructor(private readonly solicitudService: SolicitudService) {}

    /**
     * Endpoint para crear una nueva solicitud.
     * POST /solicitudes
     */
    @Post('crear')
    @HttpCode(HttpStatus.CREATED)
    create(@Body() crearSolicitudDto: CrearSolicitudDto) {
        // El decorador @Body() extrae los datos del cuerpo de la petición
        // y los valida usando el DTO.
        return this.solicitudService.create(crearSolicitudDto);
    }

    /**
     * Endpoint para obtener todas las solicitudes.
     * GET /solicitudes
     */
    @Get('listar')
    findAll() {
        return this.solicitudService.findAll();
    }

    /**
     * Endpoint para obtener una solicitud por su ID.
     * GET /solicitudes/:id
     */
    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        // El decorador @Param('id') extrae el ID de la URL.
        // ParseIntPipe convierte el ID de string a número y valida que sea un entero.
        return this.solicitudService.findOne(id);
    }

    /**
     * Endpoint para actualizar una solicitud por su ID.
     * PATCH /solicitudes/:id
     */
    @Put(':id')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() actualizarSolicitudDto: ActualizarSolicitudDto,
    ) {
        return this.solicitudService.update(id, actualizarSolicitudDto);
    }

    /**
     * Endpoint para eliminar una solicitud por su ID.
     * DELETE /solicitudes/:id
     */
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT) // Devuelve un código 204 en lugar de 200 en caso de éxito.
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.solicitudService.remove(id);
    }
}