import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { ArrayNotEmpty, IsArray, IsDate, IsNotEmpty, IsOptional, IsUUID } from "class-validator";
import { ProductDto } from "src/modules/product/dto/product-dto";
import { ClientDto } from '../../client/dto/client-dto';

export class OrderDto 
{
  @ApiProperty({ name: 'id', type: String, required: false, description: 'Id del order (uuid)' })
  @IsOptional()
  @IsUUID()
  id?: string;

  @ApiProperty({ name: 'createAt', type: Date, required: false, description: 'CreateAt del order' })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  createAt?: Date;

  @ApiProperty({ name: 'updateAt', type: Date, required: false, description: 'UpdateAt del order' })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  updateAt?: Date;

  @ApiProperty({ name: 'confirmAt', type: Date, required: false, description: 'ConfirmAt del order' })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  confirmAt?: Date;

  @ApiProperty({ name: 'client', type: ClientDto, required: true, description: 'Client del order' })
  @IsNotEmpty()
  @Type(() => ClientDto)
  client!: ClientDto;

  @ApiProperty({ name: 'products', type: ProductDto, isArray: true, required: true, description: 'Product del order' })
  @IsNotEmpty()
  @IsArray()
  @ArrayNotEmpty()
  @Type(() => ProductDto)
  products!: ProductDto[];
}