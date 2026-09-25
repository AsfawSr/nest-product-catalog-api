import { Inject, Injectable } from '@nestjs/common';
import type { IProductRepository } from '../../domain/repositories/product.repository.interface.js';
import { PRODUCT_REPOSITORY_TOKEN } from '../../domain/repositories/product.repository.interface.js';
import { ProductOutputDto } from '../dtos/product-output.dto.js';
import { QueryProductsDto } from '../../dto/query-products.dto.js';
import { PageDto } from '../../../common/pagination/page.dto.js';
import { PageMetaDto } from '../../../common/pagination/page-meta.dto.js';

@Injectable()
export class GetProductsUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY_TOKEN)
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(query?: QueryProductsDto): Promise<PageDto<ProductOutputDto>> {
    const pageOptions = query ?? new QueryProductsDto();

    const paginatedResult = await this.productRepository.findAll({
      category: pageOptions.category,
      search: pageOptions.search,
      minPrice: pageOptions.minPrice,
      maxPrice: pageOptions.maxPrice,
      skip: pageOptions.skip,
      limit: pageOptions.pageSize,
      order: pageOptions.order,
      sortBy: pageOptions.sortBy,
    });

    const items = paginatedResult.items.map((product) =>
      ProductOutputDto.fromDomain(product),
    );

    const pageMetaDto = new PageMetaDto({
      pageOptionsDto: pageOptions,
      itemCount: paginatedResult.total,
    });

    return new PageDto(items, pageMetaDto);
  }
}
