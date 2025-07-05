import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, OneToMany} from 'typeorm';
import { Estudiante } from '../estudiante/estudiante.entity';
import { Tutor } from '../tutor/tutor.entity';
import { Materia } from '../materia/materia.entity';


@Entity('solicitudes') // Es una buena práctica nombrar las tablas en plural
export class Solicitud {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'date' })
    fecha_solicitada: string;

    @Column({ type: 'time' })
    hora_solicitada: string;

    @Column({ length: 50, default: 'pendiente' })
    estado: string;

    @CreateDateColumn({ type: 'timestamp', name: 'fecha_creacion' }) 
    fecha_creacion: Date;

    @ManyToOne(() => Estudiante)
    @JoinColumn({ name: 'estudiante_id' })
    estudiante: Estudiante;

    @ManyToOne(() => Tutor, { nullable: true }) 
    @JoinColumn({ name: 'tutor_id' })
    tutor?: Tutor;

    @ManyToOne(() => Materia)
    @JoinColumn({ name: 'materia_id' })
    materia: Materia;
}