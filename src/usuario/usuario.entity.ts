import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  nombre: string;

  @Column({ unique: true, length: 100 })
  correo: string;

  @Column({ length: 255 })
  contraseña: string;

  @Column({ default: true })
  activo: boolean;

  // default: () => 'CURRENT_TIMESTAMP'
  // Si no se proporciona un valor al insertar el usuario, la base de datos pondrá automáticamente la fecha y hora actuales.

  // type: 'timestamp'
  // Esto le dice a PostgreSQL que el tipo de dato será TIMESTAMP.
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fecha_creacion: Date;
}
