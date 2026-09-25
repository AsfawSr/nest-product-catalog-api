import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductOrmEntity } from './infrastructure/persistence/product.orm-entity.js';
import { ProductTypeOrmRepository } from './infrastructure/persistence/product.typeorm-repository.js';
import { PRODUCT_REPOSITORY_TOKEN } from './domain/repositories/product.repository.interface.js';
import { CreateProductUseCase } from './application/use-cases/create-product.use-case.js';
import { GetProductsUseCase } from './application/use-cases/get-products.use-case.js';
import { GetProductByIdUseCase } from './application/use-cases/get-product-by-id.use-case.js';
import { UpdateProductUseCase } from './application/use-cases/update-product.use-case.js';
import { DeleteProductUseCase } from './application/use-cases/delete-product.use-case.js';
import { ProductsController } from './products.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([ProductOrmEntity])],
  controllers: [ProductsController],
  providers: [
    {
      provide: PRODUCT_REPOSITORY_TOKEN,
      useClass: ProductTypeOrmRepository,
    },
    CreateProductUseCase,
    GetProductsUseCase,
    GetProductByIdUseCase,
    UpdateProductUseCase,
    DeleteProductUseCase,
  ],
  exports: [
    PRODUCT_REPOSITORY_TOKEN,
    CreateProductUseCase,
    GetProductsUseCase,
    GetProductByIdUseCase,
    UpdateProductUseCase,
    DeleteProductUseCase,
  ],
})
export class ProductsModule {}
