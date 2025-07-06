import {
    IsDateString,
    IsOptional,
    Matches
} from 'class-validator';

export class ActualizarSolicitudDto {
  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'La fecha debe tener formato yyyy-MM-dd.' })
  @IsDateString({}, { message: 'La fecha debe ser una cadena con formato válido ISO (yyyy-mm-dd).' })
  fecha_solicitada?: string;

  @IsOptional()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: 'La hora debe tener formato HH:mm.' })
  hora_solicitada?: string;
}