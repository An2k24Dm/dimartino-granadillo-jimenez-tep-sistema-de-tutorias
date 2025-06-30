import { Matches, IsEmail, MinLength, MaxLength, IsNotEmpty, Length } from 'class-validator';

export class CrearCoordinadorDto {
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @Length(3, 100, { message: 'El nombre debe tener entre 3 y 100 caracteres' })
  @Matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/, { message: 'El nombre no debe contener números ni caracteres especiales' })
  nombre: string;

  @IsEmail({}, { message: 'El correo debe tener un formato válido' })
  correo: string;

  @MinLength(10, { message: 'La contraseña debe tener al menos 10 caracteres' })
  @MaxLength(20, { message: 'La contraseña no debe exceder los 20 caracteres' })
  @Matches(/^\S+$/, { message: 'La contraseña no debe contener espacios en blanco' })
  contraseña: string;

  @IsNotEmpty({ message: 'La cédula es obligatoria' })
  @Length(6, 20, { message: 'La cédula debe tener entre 6 y 20 caracteres' })
  @Matches(/^\d+$/, { message: 'La cédula solo debe contener números' })
  cedula: string;

  @IsNotEmpty({ message: 'El departamento es obligatorio' })
  @Length(3, 100, { message: 'El departamento debe tener entre 3 y 100 caracteres' })
  @Matches(/^[^\d]*$/, { message: 'El departamento no debe contener números' })
  departamento: string;

  @IsNotEmpty({ message: 'La extensión interna es obligatoria' })
  @Length(3, 20, { message: 'La extensión debe tener entre 3 y 20 caracteres' })
  @Matches(/^\d+$/, { message: 'La extensión solo debe contener números y no debe tener espacios ni letras' })
  extension_interna: string;
}
