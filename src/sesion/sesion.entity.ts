import { Entity,PrimaryGeneratedColumn,Column,ManyToOne,OneToOne,JoinColumn,Unique,} from 'typeorm';
import { Solicitud } from '../solicitud/solicitud.entity';
import { Tutor } from '../tutor/tutor.entity';
import { Estudiante } from '../estudiante/estudiante.entity';
import { Materia } from '../materia/materia.entity';

@Entity('sesion') 
@Unique(['solicitud']) 
export class Sesion {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Solicitud, { onDelete: 'CASCADE' }) 
  @JoinColumn({ name: 'solicitud_id' }) 
  solicitud: Solicitud;

  @ManyToOne(() => Estudiante)
  @JoinColumn({ name: 'estudiante_id' })
  estudiante: Estudiante;

  @ManyToOne(() => Tutor)
  @JoinColumn({ name: 'tutor_id' })
  tutor: Tutor;

  @ManyToOne(() => Materia)
  @JoinColumn({ name: 'materia_id' })
  materia: Materia;

  @Column({ type: 'date', name: 'fecha_sesion' })
  fechaSesion: Date;

  @Column({ type: 'time', name: 'hora_sesion' })
  horaSesion: Date;

  @Column({ default: false })
  completada: boolean;
}
