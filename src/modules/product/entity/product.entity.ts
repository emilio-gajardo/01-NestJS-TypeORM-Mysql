import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Product
{
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ type: String, nullable: false, length: 30 })
  name!: string;

  @Column({ type: Number, nullable: false, default: 0 })
  price!: number;

  @Column({ type: Number, nullable: false, default: 0 })
  stock!: number;

  @Column({ type: Boolean, nullable: false, default: false })
  deleted?: boolean;
}
