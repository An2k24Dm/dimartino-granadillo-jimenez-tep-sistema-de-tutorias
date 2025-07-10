import {
  IsOptional,
  Length,
  Matches,
  MinLength,
  MaxLength,
  IsEmail,
} from 'class-validator';

export class ActualizarPerfilCoordinadorDto {
  @IsOptional()
  @Length(3, 100, { message: 'El nombre debe tener entre 3 y 100 caracteres' })
  @Matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/, { message: 'El nombre no debe contener números ni caracteres especiales' })
  nombre?: string;

  @IsOptional()
  @IsEmail({}, { message: 'El correo debe tener un formato válido' })
  correo?: string;

  @IsOptional()
  @MinLength(10, { message: 'La contraseña debe tener al menos 10 caracteres' })
  @MaxLength(20, { message: 'La contraseña no debe exceder los 20 caracteres' })
  @Matches(/^\S+$/, { message: 'La contraseña no debe contener espacios' })
  contraseña?: string;

  @IsOptional()
  @Length(6, 20, { message: 'La cédula debe tener entre 6 y 20 caracteres' })
  @Matches(/^\d+$/, { message: 'La cédula solo debe contener números' })
  cedula?: string;

  @IsOptional()
  @Length(3, 100, { message: 'El departamento debe tener entre 3 y 100 caracteres' })
  @Matches(/^[^\d]*$/, { message: 'El departamento no debe contener números' })
  departamento?: string;

  @IsOptional()
  @Length(3, 20, { message: 'La extensión debe tener entre 3 y 20 caracteres' })
  @Matches(/^\d+$/, { message: 'La extensión solo debe contener números' })
  extension_interna?: string;
}
