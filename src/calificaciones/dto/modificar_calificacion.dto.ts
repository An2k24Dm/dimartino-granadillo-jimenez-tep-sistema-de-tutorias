import {
    IsNumber,
    IsOptional,
    IsString,
    Max,
    Min,
} from 'class-validator';

export class UpdateCalificacionDto {
    /**
     * La nueva nota de la calificación. Opcional.
     */
    @IsNumber()
    @Min(1)
    @Max(5)
    readonly calificacion: number;

    /**
     * El nuevo comentario. Opcional.
     */
    @IsString()
    @IsOptional()
    comentario?: string;
    
}