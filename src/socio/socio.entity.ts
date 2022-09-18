import { ClubEntity } from '../club/club.entity';
import { Column, Entity, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';

@Entity()
export class SocioEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    nombreUsuario: string;

    @Column()
    correo: string;

    @Column({ type: 'date' })
    fechaNacimiento: string;

    @ManyToMany(() => ClubEntity, club => club.socios)
    clubes: ClubEntity[];
}
