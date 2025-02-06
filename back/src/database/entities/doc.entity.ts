import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Faulty } from "./faulty.entity";

export enum Status {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
}

@Entity()
export class Doc {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  size: number;

  @Column({
    type: 'enum',
    enum: Status,
    default: Status.PENDING
  })
  status: Status;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Faulty, faulty => faulty.doc)
  errors: Faulty[]
}