import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Product } from '../../domain/models/product.model.js';

export class ProductOutputDto {
  @ApiProperty({ example: 1, description: 'Unique product identifier' })
  id: number;

  @ApiProperty({
    example: 'Keychron Q1 Pro',
    description: 'Product display name',
  })
  name: string;

  @ApiPropertyOptional({
    example: 'Wireless custom mechanical keyboard',
    description: 'Product description',
  })
  description?: string;

  @ApiProperty({ example: 199.99, description: 'Product price in USD' })
  price: number;

  @ApiProperty({ example: 'Electronics', description: 'Product category' })
  category: string;

  @ApiProperty({ example: 15, description: 'Current available stock quantity' })
  stock: number;

  @ApiProperty({
    example: '2026-09-25T08:10:38.139Z',
    description: 'Timestamp when created',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2026-09-25T08:10:38.139Z',
    description: 'Timestamp when last updated',
  })
  updatedAt: Date;

  public static fromDomain(product: Product): ProductOutputDto {
    const dto = new ProductOutputDto();
    dto.id = product.id!;
    dto.name = product.name;
    dto.description = product.description;
    dto.price = product.price.value;
    dto.category = product.category;
    dto.stock = product.stock.quantity;
    dto.createdAt = product.createdAt;
    dto.updatedAt = product.updatedAt;
    return dto;
  }
}
