import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { Usuario } from '../usuario/usuario.entity'; // Asegúrate de que la ruta a tu entidad Usuario sea correcta

@Entity('log')
export class Log {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'usuario_id' })
    usuarioId: number;

    @Column({ length: 100 })
    accion: string;

    @Column({ length: 100, nullable: true })
    ruta: string;

    @Column({ length: 10, nullable: true })
    metodo: string;

    @CreateDateColumn({ name: 'timestamp', type: 'timestamp with time zone' })
    timestamp: Date;

    @ManyToOne(() => Usuario)
    @JoinColumn({ name: 'usuario_id' })
    usuario: Usuario;
}