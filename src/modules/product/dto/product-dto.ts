import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from "class-validator";

// ?: = es opcional
// !: = no permite null

export class ProductDto
{
  @ApiProperty({ name: "id", required: false, description: "Id del producto", type: Number })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  id?: number;

  @ApiProperty({ name: "id", required: true, description: "Nombre del producto", type: String })
  @IsNotEmpty()
  @IsString()
  name!: string;

  @ApiProperty({ name: "price", required: true, description: "Precio del producto", type: Number })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  price!: number;

  @ApiProperty({ name: "stock", required: true, description: "Stock del producto", type: Number })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  stock!: number;

  @ApiProperty({ name: "delete", required: false, description: "Estado de dsiponibilidad del producto", type: Boolean })
  @IsOptional()
  @IsBoolean()
  deleted?: boolean;
}
