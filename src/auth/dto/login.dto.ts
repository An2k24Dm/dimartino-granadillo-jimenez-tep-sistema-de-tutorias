import { IsEmail, MinLength, MaxLength } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'El correo debe tener un formato válido' })
  correo: string;

  @MinLength(10, { message: 'La contraseña debe tener al menos 10 caracteres' })
  @MaxLength(20, { message: 'La contraseña no debe exceder los 20 caracteres' })
  contraseña: string;
}
