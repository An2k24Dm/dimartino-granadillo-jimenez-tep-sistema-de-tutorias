import { IsNotEmpty, IsString, Matches, MaxLength } from 'class-validator';

export class CrearMateriaDto {
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @IsString({ message: 'El nombre debe ser una cadena' })
  @MaxLength(100, { message: 'El nombre no puede tener más de 100 caracteres' })
  @Matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/, {message: 'El nombre solo puede contener letras y espacios (sin números ni caracteres especiales)',})
  nombre: string;

  @IsNotEmpty({ message: 'El código es obligatorio' })
  @IsString({ message: 'El código debe ser una cadena' })
  @Matches(/^[A-Za-z0-9]+$/, {message: 'El código solo puede contener letras y números (sin espacios ni caracteres especiales)',})
  @MaxLength(20, { message: 'El código no puede tener más de 20 caracteres' })
  codigo: string;
}