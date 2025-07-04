import { Entity,PrimaryGeneratedColumn,Column,ManyToOne,JoinColumn,Unique,} from 'typeorm';
import { Solicitud } from '../solicitud/solicitud.entity';
import { Tutor } from '../tutor/tutor.entity';
import { Estudiante } from '../estudiante/estudiante.entity';
import { Materia } from '../materia/materia.entity';

@Entity()
@Unique(['solicitud'])
export class Sesion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  fecha: Date;

  @Column({ type: 'time' })
  hora: string;

  @Column({ default: false })
  completada: boolean;

  @ManyToOne(() => Solicitud)
  @JoinColumn({ name: 'solicitud_id' })
  solicitud: Solicitud;

  @ManyToOne(() => Tutor)
  @JoinColumn({ name: 'tutor_id' })
  tutor: Tutor;

  @ManyToOne(() => Estudiante)
  @JoinColumn({ name: 'estudiante_id' })
  estudiante: Estudiante;

  @ManyToOne(() => Materia)
  @JoinColumn({ name: 'materia_id' })
  materia: Materia;
}