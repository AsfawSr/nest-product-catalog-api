import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CreateProductUseCase } from './create-product.use-case.js';
import type { IProductRepository } from '../../domain/repositories/product.repository.interface.js';
import { Product } from '../../domain/models/product.model.js';
import { DomainEventDispatcher } from '../../../common/events/domain-event-dispatcher.service.js';

describe('CreateProductUseCase', () => {
  let useCase: CreateProductUseCase;
  let mockRepo: IProductRepository;
  let mockDispatcher: DomainEventDispatcher;

  beforeEach(() => {
    mockRepo = {
      save: vi.fn().mockImplementation((product: Product) => {
        return Promise.resolve(
          Product.reconstitute({
            id: 10,
            name: product.name,
            description: product.description,
            price: product.price,
            category: product.category,
            stock: product.stock,
            createdAt: product.createdAt,
            updatedAt: product.updatedAt,
          }),
        );
      }),
      findById: vi.fn(),
      findAll: vi.fn(),
      delete: vi.fn(),
    };

    mockDispatcher = {
      dispatch: vi.fn(),
    } as unknown as DomainEventDispatcher;

    useCase = new CreateProductUseCase(mockRepo, mockDispatcher);
  });

  it('should create, save, and dispatch ProductCreatedEvent', async () => {
    const result = await useCase.execute({
      name: 'Wireless Keyboard',
      description: 'Compact mechanical keyboard',
      price: 119.99,
      category: 'Electronics',
      stock: 20,
    });

    expect(mockRepo.save).toHaveBeenCalledTimes(1);
    expect(mockDispatcher.dispatch).toHaveBeenCalledTimes(1);
    expect(result.id).toBe(10);
    expect(result.name).toBe('Wireless Keyboard');
    expect(result.price).toBe(119.99);
    expect(result.stock).toBe(20);
  });
});
