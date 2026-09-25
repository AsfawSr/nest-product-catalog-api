import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Min,
  MinLength,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3, { message: 'Product name must have at least 3 characters' })
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsPositive({ message: 'Price must be greater than zero' })
  price: number;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsInt()
  @Min(0, { message: 'Stock cannot be negative' })
  stock: number;
}

