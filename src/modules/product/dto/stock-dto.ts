import { ApiParam, ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsPositive, Max, Min } from "class-validator";

export class StockDto
{

  @ApiProperty({ name: "id", required: true, description: "Id del producto", type: Number })
  @IsNotEmpty()
  @IsPositive()
  @IsNumber()
  id: number;


  @ApiProperty({ name: "stock", required: true, description: "Stock del producto", type: Number })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(1000)
  stock: number;
}