import { Product } from '../../domain/models/product.model.js';

export class ProductOutputDto {
  id: number;
  name: string;
  description?: string;
  price: number;
  category: string;
  stock: number;
  createdAt: Date;
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
