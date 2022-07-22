import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from "class-validator";

export class AddressDto
{

  @ApiProperty({ name: 'id', type: Number, required: false, description: 'Id del address' })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  id?: number;

  @ApiProperty({ name: 'country', type: String, required: true, description: 'Country del address' })
  @IsNotEmpty()
  @IsString()
  country!: string;

  @ApiProperty({ name: 'province', type: String, required: true, description: 'Province del address' })
  @IsNotEmpty()
  @IsString()
  province!: string;

  @ApiProperty({ name: 'town', type: String, required: true, description: 'Town del address' })
  @IsNotEmpty()
  @IsString()
  town!: string;

  @ApiProperty({ name: 'street', type: String, required: true, description: 'Street del address' })
  @IsNotEmpty()
  @IsString()
  street!: string;
}