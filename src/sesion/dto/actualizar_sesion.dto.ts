import { IsOptional, Matches } from 'class-validator';

export class ActualizarSesionDto {
  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'La fecha debe tener formato yyyy-MM-dd.',
  })
  fechaSesion?: string;

  @IsOptional()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'La hora debe tener formato HH:mm.',
  })
  horaSesion?: string;
}
