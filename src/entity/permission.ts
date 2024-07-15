import { PrimaryGeneratedColumn, Column, Entity,CreateDateColumn, UpdateDateColumn,ManyToOne } from "typeorm";

@Entity()
export default class Permission {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()       
    resource: string;
    @Column()
    role: string;
    @Column()
    action: string;
    @CreateDateColumn({ type: "timestamp" })
    created_at: Date;
    @UpdateDateColumn({ type: "timestamp" })
    updated_at: Date;
   
}