import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GetProductsUseCase } from './get-products.use-case.js';
import type { IProductRepository } from '../../domain/repositories/product.repository.interface.js';
import { Product } from '../../domain/models/product.model.js';
import { Price } from '../../domain/value-objects/price.vo.js';
import { Stock } from '../../domain/value-objects/stock.vo.js';
import { QueryProductsDto } from '../../dto/query-products.dto.js';

describe('GetProductsUseCase (Pagination)', () => {
  let useCase: GetProductsUseCase;
  let mockRepo: IProductRepository;

  const sampleProducts = [
    Product.reconstitute({
      id: 1,
      name: 'Mechanical Keyboard',
      price: Price.create(100),
      category: 'Electronics',
      stock: Stock.create(10),
    }),
    Product.reconstitute({
      id: 2,
      name: 'Wireless Mouse',
      price: Price.create(50),
      category: 'Electronics',
      stock: Stock.create(20),
    }),
  ];

  beforeEach(() => {
    mockRepo = {
      findAll: vi.fn().mockResolvedValue({
        items: sampleProducts,
        total: 15, // 15 items in total database
      }),
      save: vi.fn(),
      findById: vi.fn(),
      delete: vi.fn(),
    };

    useCase = new GetProductsUseCase(mockRepo);
  });

  it('should return PageDto with correct metadata and page count', async () => {
    const query = new QueryProductsDto();
    // page 1, limit 10
    const result = await useCase.execute(query);

    expect(result.data.length).toBe(2);
    expect(result.meta.page).toBe(1);
    expect(result.meta.limit).toBe(10);
    expect(result.meta.itemCount).toBe(15);
    expect(result.meta.pageCount).toBe(2); // 15 / 10 = 2 pages
    expect(result.meta.hasPreviousPage).toBe(false);
    expect(result.meta.hasNextPage).toBe(true);
  });
});
