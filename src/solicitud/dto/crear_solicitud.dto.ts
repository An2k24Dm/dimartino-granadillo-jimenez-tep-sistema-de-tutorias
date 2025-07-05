import {
  IsDateString,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';

/**
 * Define la estructura de datos y las reglas de validación
 * para crear una nueva solicitud.
 */
export class CrearSolicitudDto {

  
  @IsDateString()
  readonly fecha_solicitada: string;

  @IsString()
  readonly hora_solicitada: string;

  // ... otros campos ...

  /**
   * ID del estudiante que realiza la solicitud.
   * Debe ser un número entero y positivo.
   */
  @IsInt() // Correcto para recibir números
  @IsPositive()
  readonly estudiante_id: number;

  /**
   * ID de la materia para la cual se solicita la tutoría.
   * Debe ser un número entero y positivo.
   */
  @IsInt() // Correcto para recibir números
  @IsPositive()
  readonly materia_id: number;

  /**
   * ID del tutor asignado. Es opcional.
   */
  @IsOptional()
  @IsInt() // Correcto para recibir números
  @IsPositive()
  readonly tutor_id?: number;
  
}
