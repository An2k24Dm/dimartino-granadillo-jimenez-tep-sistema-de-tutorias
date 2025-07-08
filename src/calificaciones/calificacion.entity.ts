import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, OneToMany} from 'typeorm';
import { Estudiante } from '../estudiante/estudiante.entity';
import { Tutor } from '../tutor/tutor.entity';
import { Sesion } from '../sesion/sesion.entity';

@Entity('calificacion') 
export class Calificacion {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'int' })
    calificacion: number;

    @Column({ type: 'text' })
    comentario: string;

    @ManyToOne(() => Estudiante)
    @JoinColumn({ name: 'estudiante_id' })
    estudiante: Estudiante;

    @ManyToOne(() => Tutor) 
    @JoinColumn({ name: 'tutor_id' })
    tutor: Tutor;

    @ManyToOne(() => Sesion)
    @JoinColumn({ name: 'sesion_id' })
    sesion: Sesion;
}