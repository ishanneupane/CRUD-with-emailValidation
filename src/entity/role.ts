import{Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn,OneToMany} from "typeorm";
import Permission from "./permission";
@Entity()
export default class Role {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    name: string;
    @Column()
    key: string;
    @CreateDateColumn({ type: "timestamp" })
    created_at: Date;
    @UpdateDateColumn({ type: "timestamp" })
    updated_at: Date;
    @OneToMany(()=>Permission,permission=>permission.role)
    permissions:Permission[]
}