import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, Max, Min, Matches, Length } from 'class-validator';

export class CreateCalificacionDto {
    @IsNumber()
    @Min(1)
    @Max(5)
    @IsNotEmpty()
    readonly calificacion: number;

    @IsString()
    @IsOptional()
    readonly comentario?: string;

    @IsInt()
    @IsPositive()
    @IsNotEmpty()
    readonly sesionId: number;
}