import { Inject, Injectable } from '@nestjs/common';
import type { IProductRepository } from '../../domain/repositories/product.repository.interface.js';
import { PRODUCT_REPOSITORY_TOKEN } from '../../domain/repositories/product.repository.interface.js';
import { Product } from '../../domain/models/product.model.js';
import { ProductOutputDto } from '../dtos/product-output.dto.js';

export interface CreateProductCommand {
  name: string;
  description?: string;
  price: number;
  category: string;
  stock: number;
}

@Injectable()
export class CreateProductUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY_TOKEN)
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(command: CreateProductCommand): Promise<ProductOutputDto> {
    const product = Product.create({
      name: command.name,
      description: command.description,
      price: command.price,
      category: command.category,
      stock: command.stock,
    });

    const saved = await this.productRepository.save(product);
    return ProductOutputDto.fromDomain(saved);
  }
}
