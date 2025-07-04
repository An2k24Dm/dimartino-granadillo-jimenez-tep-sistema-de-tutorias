import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { Estudiante } from '../estudiante/estudiante.entity'; 
import { Materia } from '../materia/materia.entity'; 
import { Tutor } from '../tutor/tutor.entity'; 

@Entity() 
export class Solicitud {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'estudiante_id' })
  estudianteId: number;

  @Column({ name: 'materia_id' })
  materiaId: number;

  @Column({ type: 'date', name: 'fecha_solicitada' })
  fechaSolicitada: Date; 

  @Column({ type: 'time', name: 'hora_solicitada' })
  horaSolicitada: Date; 

  @Column({ length: 20, default: 'Pendiente' }) 
  estado: string;

  @Column({ name: 'tutor_id', nullable: true }) 
  tutorId: number;

  @Column({
    type: 'timestamp',
    name: 'fecha_creacion',
    default: () => 'CURRENT_TIMESTAMP',
  })
  fechaCreacion: Date;

  // Relaciones con otras entidades
@ManyToOne(() => Estudiante)
  @JoinColumn({ name: 'estudiante_id' })
  estudiante: Estudiante;

  @ManyToOne(() => Materia)
  @JoinColumn({ name: 'materia_id' })
  materia: Materia;

  @ManyToOne(() => Tutor, { nullable: true })
  @JoinColumn({ name: 'tutor_id' })
  tutor: Tutor;

}