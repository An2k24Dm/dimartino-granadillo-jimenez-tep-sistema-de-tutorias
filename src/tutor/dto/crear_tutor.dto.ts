import { Matches, IsEmail, MinLength, MaxLength, IsNotEmpty, Length } from 'class-validator';
import { EsTelefonoValido } from '../../common/decorators/es_telefono.decorator';

export class CrearTutorDto {
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

  @IsNotEmpty({ message: 'La profesión es obligatoria' })
  @Length(2, 100, { message: 'La profesión debe tener entre 2 y 100 caracteres' })
  @Matches(/^[^\d]*$/, { message: 'La pofesión no debe contener números' })
  profesion: string;

  @IsNotEmpty({ message: 'La experiencia es obligatoria' })
  @Length(10, 500, { message: 'La experiencia debe tener entre 10 y 500 caracteres' })
  experiencia: string;

  @IsNotEmpty({ message: 'El teléfono es obligatorio' })
  @EsTelefonoValido({ message: 'El teléfono debe iniciar con 0414, 0424, 0416, 0426 o 0212 y estar separado por "-"' })
  telefono: string;
}
