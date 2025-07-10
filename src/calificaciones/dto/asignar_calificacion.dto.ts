import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, Max, Min, Matches, Length } from 'class-validator';

export class CreateCalificacionDto {
    @IsNumber()
    @Min(1)
    @Max(5)
    @IsNotEmpty({ message: 'El campo calificaión no puede estar vacío.' }) 
    readonly calificacion: number;

    @IsString()
    @IsOptional()
    comentario?: string;

    @IsInt({ message: 'El campo sesión debe tener un número entero' })
    @IsPositive({ message: 'El campo sesión debe tener un número positivo' })
    @IsNotEmpty({ message: 'El campo sesión no puede estar vacío.' }) 
    readonly sesionId: number;
}