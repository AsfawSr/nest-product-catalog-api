import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { IProductRepository } from '../../domain/repositories/product.repository.interface.js';
import { PRODUCT_REPOSITORY_TOKEN } from '../../domain/repositories/product.repository.interface.js';
import { ProductOutputDto } from '../dtos/product-output.dto.js';

export interface UpdateProductCommand {
  name?: string;
  description?: string;
  price?: number;
  category?: string;
  stock?: number;
}

@Injectable()
export class UpdateProductUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY_TOKEN)
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(
    id: number,
    command: UpdateProductCommand,
  ): Promise<ProductOutputDto> {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    if (command.price !== undefined) {
      product.changePrice(command.price);
    }

    if (command.stock !== undefined) {
      const currentStock = product.stock.quantity;
      const difference = command.stock - currentStock;
      if (difference > 0) {
        product.addStock(difference);
      } else if (difference < 0) {
        product.decreaseStock(Math.abs(difference));
      }
    }

    product.updateDetails(command.name, command.description, command.category);

    const saved = await this.productRepository.save(product);
    return ProductOutputDto.fromDomain(saved);
  }
}
