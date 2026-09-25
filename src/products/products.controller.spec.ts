import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller.js';
import { CreateProductUseCase } from './application/use-cases/create-product.use-case.js';
import { GetProductsUseCase } from './application/use-cases/get-products.use-case.js';
import { GetProductByIdUseCase } from './application/use-cases/get-product-by-id.use-case.js';
import { UpdateProductUseCase } from './application/use-cases/update-product.use-case.js';
import { DeleteProductUseCase } from './application/use-cases/delete-product.use-case.js';

describe('ProductsController', () => {
  let controller: ProductsController;

  const mockCreateProductUseCase = { execute: vi.fn() };
  const mockGetProductsUseCase = { execute: vi.fn() };
  const mockGetProductByIdUseCase = { execute: vi.fn() };
  const mockUpdateProductUseCase = { execute: vi.fn() };
  const mockDeleteProductUseCase = { execute: vi.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        { provide: CreateProductUseCase, useValue: mockCreateProductUseCase },
        { provide: GetProductsUseCase, useValue: mockGetProductsUseCase },
        {
          provide: GetProductByIdUseCase,
          useValue: mockGetProductByIdUseCase,
        },
        { provide: UpdateProductUseCase, useValue: mockUpdateProductUseCase },
        { provide: DeleteProductUseCase, useValue: mockDeleteProductUseCase },
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
