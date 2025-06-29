import {
  IsOptional,
  Length,
  Matches,
  IsEmail,
  MinLength,
  MaxLength,
  IsNotEmpty,
  IsNumber,
  Min,
  Max,
} from 'class-validator';
import { EsTelefonoValido } from '../../common/decorators/es_telefono.decorator';
import { Type } from 'class-transformer';

export class ActualizarUsuarioCompletoDto {
  // Usuario
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
  @Matches(/^\S+$/, { message: 'La contraseña no debe contener espacios en blanco' })
  contraseña?: string;

  // Estudiante
  @IsOptional()
  @Length(6, 20, { message: 'La cédula debe tener entre 6 y 20 caracteres' })
  @Matches(/^\d+$/, { message: 'La cédula solo debe contener números' })
  cedula?: string;

  @IsOptional()
  @Length(2, 100, { message: 'La carrera debe tener entre 2 y 100 caracteres' })
  @Matches(/^[^\d]*$/, { message: 'La carrera no debe contener números' })
  carrera?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'El semestre debe ser un número' })
  @Min(1, { message: 'El semestre mínimo es 1' })
  @Max(10, { message: 'El semestre máximo es 10' })
  semestre?: number;

  @IsOptional()
  @EsTelefonoValido({ message: 'El teléfono debe iniciar con 0414, 0424, 0416, 0426 o 0212 y estar separado por "-"' })
  telefono?: string;

  // Coordinador
  @IsOptional()
  @Length(3, 100, { message: 'El departamento debe tener entre 3 y 100 caracteres' })
  @Matches(/^[^\d]*$/, { message: 'El departamento no debe contener números' })
  departamento?: string;

  @IsOptional()
  @Length(3, 20, { message: 'La extensión debe tener entre 3 y 20 caracteres' })
  @Matches(/^\d+$/, { message: 'La extensión solo debe contener números y no debe tener espacios ni letras' })
  extension_interna?: string;

  // Tutor
  @IsOptional()
  @Length(2, 100, { message: 'La profesión debe tener entre 2 y 100 caracteres' })
  @Matches(/^[^\d]*$/, { message: 'La pofesión no debe contener números' })
  profesion?: string;

  @IsOptional()
  @Length(10, 500, { message: 'La experiencia debe tener entre 10 y 500 caracteres' })
  experiencia?: string;
}
