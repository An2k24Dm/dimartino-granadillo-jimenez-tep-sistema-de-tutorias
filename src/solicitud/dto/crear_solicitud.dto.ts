import {
  IsInt,
  IsString,
  IsNotEmpty,
  IsDateString,
  Matches,
  IsOptional, 
  MaxLength,
  Length
} from 'class-validator';


export class CrearSolicitudDto {
  
  @IsDateString(
    {}, 
    { message: 'La fecha solicitada debe tener un formato de fecha válido (YYYY-MM-DD).' } 
  )
  @IsNotEmpty({ message: 'La fecha solicitada no puede estar vacía.' }) 
  fechaSolicitada: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)(:([0-5]\d))?$/, {
    message: 'La hora debe estar en formato HH:MM o HH:MM:SS',
  })
  horaSolicitada: string;

  @IsNotEmpty({ message: 'La cédula es obligatoria' })
  @Length(6, 20, { message: 'La cédula debe tener entre 6 y 20 caracteres' })
  @Matches(/^\d+$/, { message: 'La cédula solo debe contener números' })
  cedulaTutor: string;
}
