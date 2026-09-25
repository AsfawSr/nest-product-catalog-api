import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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
  @ApiProperty({
    example: 'Sony WH-1000XM5',
    description: 'Name of the product (minimum 3 characters)',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3, { message: 'Product name must have at least 3 characters' })
  name: string;

  @ApiPropertyOptional({
    example: 'Wireless Noise-Canceling Headphones with Auto NC Optimizer',
    description: 'Detailed description of the product',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: 399.99,
    description: 'Price in USD (must be positive)',
  })
  @IsNumber()
  @IsPositive({ message: 'Price must be greater than zero' })
  price: number;

  @ApiProperty({
    example: 'Audio',
    description: 'Category name',
  })
  @IsString()
  @IsNotEmpty()
  category: string;

  @ApiProperty({
    example: 12,
    description: 'Initial stock quantity (must be non-negative integer)',
  })
  @IsInt()
  @Min(0, { message: 'Stock cannot be negative' })
  stock: number;
}
