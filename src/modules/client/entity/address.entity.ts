import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Address
{
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ type: String, nullable: false, length: 50 })
  country!: string;

  @Column({ type: String, nullable: false, length: 50 })
  province!: string;

  @Column({ type: String, nullable: false, length: 50 })
  town!: string;

  @Column({ type: String, nullable: false, length: 100 })
  street!: string;

}