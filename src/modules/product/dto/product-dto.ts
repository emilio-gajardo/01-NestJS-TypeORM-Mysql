import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from "class-validator";

// ?: = es opcional
// !: = no permite null

export class ProductDto
{
  @IsOptional()
  @IsNumber()
  @IsPositive()
  id?: number;

  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  price!: number;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  stock!: number;

  @IsOptional()
  @IsBoolean()
  deleted?: boolean;
}
