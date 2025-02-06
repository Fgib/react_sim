import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Doc } from "./doc.entity";

@Entity()
export class Faulty {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @ManyToOne(() => Doc, doc => doc.errors)
  doc: Doc;
}