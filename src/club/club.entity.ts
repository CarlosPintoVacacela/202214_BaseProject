import { SocioEntity } from '../socio/socio.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToMany ,JoinTable} from 'typeorm';

@Entity()
export class ClubEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    nombre: string;

    @Column({ type: 'date' })
    fechaFundacion: string;


    @Column()
    imagen: string;

    @Column()
    descripcion: string;

    @ManyToMany(() => SocioEntity, socio => socio.clubes)
    @JoinTable()
    socios: SocioEntity[];

}
