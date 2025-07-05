import {
    IsDateString,
    IsInt,
    IsOptional,
    IsPositive,
    IsString,
    MaxLength,
} from 'class-validator';

/**
 * Define la estructura y validaciones para actualizar una solicitud.
 * Todos los campos son opcionales.
 */
export class ActualizarSolicitudDto {
    /**
     * Fecha para la cual se solicita la tutoría.
     * Debe ser una cadena de texto en formato de fecha (YYYY-MM-DD).
     */
    @IsOptional()
    @IsDateString()
    readonly fecha_solicitada?: string;

    /**
     * Hora para la cual se solicita la tutoría.
     * Debe ser una cadena de texto en formato de hora (HH:MM).
     */
    @IsOptional()
    @IsString()
    readonly hora_solicitada?: string;

    /**
     * Estado de la solicitud.
     */
    @IsOptional()
    @IsString()
    @MaxLength(50)
    readonly estado?: string;

    /**
     * ID del estudiante que realiza la solicitud.
     * Debe ser un número entero y positivo.
     */
    @IsOptional()
    @IsInt()
    @IsPositive()
    readonly estudianteId?: number;

    /**
     * ID de la materia para la cual se solicita la tutoría.
     * Debe ser un número entero y positivo.
     */
    @IsOptional()
    @IsInt()
    @IsPositive()
    readonly materiaId?: number;

    /**
     * ID del tutor asignado.
     */
    @IsOptional()
    @IsInt()
    @IsPositive()
    readonly tutorId?: number;
}