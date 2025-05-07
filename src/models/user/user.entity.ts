import { Entity, PrimaryColumn, Column, OneToMany } from "typeorm";

@Entity()
export class User {
  @PrimaryColumn()
  id: string;

  @Column()
  password: string;
}
