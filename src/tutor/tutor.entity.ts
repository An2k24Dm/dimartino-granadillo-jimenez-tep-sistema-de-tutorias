import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn, ManyToOne } from 'typeorm';
import { Usuario } from '../usuario/usuario.entity';
import { Materia } from '../materia/materia.entity';

@Entity()
export class Tutor {
  @PrimaryColumn()
  id: number;

  @OneToOne(() => Usuario)
  @JoinColumn({ name: 'id' })
  usuario: Usuario;

  @Column({ length: 20, unique: true })
  cedula: string;

  @Column({ length: 100 })
  profesion: string;

  @Column('text')
  experiencia: string;

  @Column({ length: 20 })
  telefono: string;

  @ManyToOne(() => Materia, { nullable: true }) //relacion parcial del lado de tutor
  @JoinColumn({ name: 'materia_id' })
  materia?: Materia;
}
