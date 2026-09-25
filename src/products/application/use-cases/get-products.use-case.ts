import { Inject, Injectable } from '@nestjs/common';
import type {
  IProductRepository,
  ProductFilter,
} from '../../domain/repositories/product.repository.interface.js';
import { PRODUCT_REPOSITORY_TOKEN } from '../../domain/repositories/product.repository.interface.js';
import { ProductOutputDto } from '../dtos/product-output.dto.js';

@Injectable()
export class GetProductsUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY_TOKEN)
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(filter?: ProductFilter): Promise<ProductOutputDto[]> {
    const products = await this.productRepository.findAll(filter);
    return products.map((product) => ProductOutputDto.fromDomain(product));
  }
}
