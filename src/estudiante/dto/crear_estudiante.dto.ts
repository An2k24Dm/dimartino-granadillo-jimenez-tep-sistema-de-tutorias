import { IsEmail, MinLength, MaxLength, IsNotEmpty, Length, IsNumber, Min, Max } from 'class-validator';
import { EsTelefonoValido } from '../../common/decorators/es_telefono.decorator';
import { Type } from 'class-transformer';

export class CrearEstudianteDto {
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @Length(2, 100, { message: 'El nombre debe tener entre 2 y 100 caracteres' })
  nombre: string;

  @IsEmail({}, { message: 'El correo debe tener un formato válido' })
  correo: string;

  @MinLength(10, { message: 'La contraseña debe tener al menos 10 caracteres' })
  @MaxLength(20, { message: 'La contraseña no debe exceder los 20 caracteres' })
  contraseña: string;

  @IsNotEmpty({ message: 'La cédula es obligatoria' })
  @Length(6, 20, { message: 'La cédula debe tener entre 6 y 20 caracteres' })
  cedula: string;

  @IsNotEmpty({ message: 'La carrera es obligatoria' })
  @Length(2, 100, { message: 'La carrera debe tener entre 2 y 100 caracteres' })
  carrera: string;

  @Type(() => Number)
  @IsNumber({}, { message: 'El semestre debe ser un número' })
  @Min(1, { message: 'El semestre mínimo es 1' })
  @Max(10, { message: 'El semestre máximo es 10' })
  semestre: number;

  @IsNotEmpty({ message: 'El teléfono es obligatorio' })
  @EsTelefonoValido({ message: 'El teléfono debe iniciar con 0414, 0424, 0416, 0426 o 0212 y estar separado por "-"' })
  telefono: string;
}
