import { Entity, PrimaryColumn, Column } from "typeorm";
import { IsEmail } from "class-validator";

@Entity()
export class User {
  @PrimaryColumn()
  @IsEmail()
  id: string;

  @Column()
  password: string;
}
