import { IsInt, IsOptional, IsPositive, IsString, IsDateString, Matches } from 'class-validator';

export class CrearSolicitudCordinadorDto {
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'La fecha solicitada debe tener formato yyyy-MM-dd.' })
  @IsDateString({}, { message: 'La fecha solicitada debe ser una fecha válida.' })
  readonly fecha_solicitada: string;

  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: 'La hora solicitada debe tener formato HH:mm.' })
  readonly hora_solicitada: string;

  @IsInt({ message: 'El ID de estudiante debe ser un número entero.' })
  @IsPositive({ message: 'El ID de estudiante debe ser positivo.' })
  readonly estudiante_id: number;

  @IsInt({ message: 'El ID de materia debe ser un número entero.' })
  @IsPositive({ message: 'El ID de materia debe ser positivo.' })
  readonly materia_id: number;

  @IsOptional()
  @IsInt({ message: 'El ID de tutor debe ser un número entero.' })
  @IsPositive({ message: 'El ID de tutor debe ser positivo.' })
  readonly tutor_id: number;
}