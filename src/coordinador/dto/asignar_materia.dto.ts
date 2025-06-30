import { IsNotEmpty, Length, Matches } from 'class-validator';

export class AsignarMateriaTutorDto {
  @IsNotEmpty({ message: 'La cédula es obligatoria' })
  @Length(6, 20, { message: 'La cédula debe tener entre 6 y 20 caracteres' })
  @Matches(/^\d+$/, { message: 'La cédula solo debe contener números' })
  cedula: string;

  @IsNotEmpty({ message: 'El código de materia es obligatorio' })
  @Length(4, 20, { message: 'El código debe tener entre 4 y 20 caracteres' })
  @Matches(/^[A-Za-z0-9]+$/, { message: 'El código solo debe contener letras y números, sin espacios ni caracteres especiales' })
  codigoMateria: string;
}