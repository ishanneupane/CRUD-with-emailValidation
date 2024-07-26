import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export default class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  name: string;

  @Column()
  password: string;

  @CreateDateColumn({ type: "timestamp" })
  created_at: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updated_at: Date;
  @Column({ default: false, nullable: true })
  isValidEmail: Boolean;
  @Column({ nullable: true })
  otp: Number;
  @Column({ nullable: true })
  otpExpiry: Date;
  @Column({ nullable: true, default: "user" })
  role: string;
}
