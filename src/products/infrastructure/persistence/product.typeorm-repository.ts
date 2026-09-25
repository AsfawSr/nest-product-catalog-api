import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  IProductRepository,
  ProductFilter,
} from '../../domain/repositories/product.repository.interface.js';
import { Product } from '../../domain/models/product.model.js';
import { ProductOrmEntity } from './product.orm-entity.js';
import { ProductMapper } from './product.mapper.js';

@Injectable()
export class ProductTypeOrmRepository implements IProductRepository {
  constructor(
    @InjectRepository(ProductOrmEntity)
    private readonly ormRepository: Repository<ProductOrmEntity>,
  ) {}

  async save(product: Product): Promise<Product> {
    const ormEntity = ProductMapper.toOrm(product);
    const saved = await this.ormRepository.save(ormEntity);
    return ProductMapper.toDomain(saved);
  }

  async findById(id: number): Promise<Product | null> {
    const ormEntity = await this.ormRepository.findOneBy({ id });
    if (!ormEntity) {
      return null;
    }
    return ProductMapper.toDomain(ormEntity);
  }

  async findAll(filter?: ProductFilter): Promise<Product[]> {
    const qb = this.ormRepository.createQueryBuilder('product');

    if (filter?.category) {
      qb.andWhere('LOWER(product.category) = LOWER(:category)', {
        category: filter.category,
      });
    }

    if (filter?.search) {
      qb.andWhere(
        '(LOWER(product.name) LIKE LOWER(:search) OR LOWER(product.description) LIKE LOWER(:search))',
        { search: `%${filter.search}%` },
      );
    }

    if (filter?.minPrice !== undefined) {
      qb.andWhere('product.price >= :minPrice', { minPrice: filter.minPrice });
    }

    if (filter?.maxPrice !== undefined) {
      qb.andWhere('product.price <= :maxPrice', { maxPrice: filter.maxPrice });
    }

    qb.orderBy('product.createdAt', 'DESC');

    const ormEntities = await qb.getMany();
    return ormEntities.map((entity) => ProductMapper.toDomain(entity));
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.ormRepository.delete(id);
    return (result.affected ?? 0) > 0;
  }
}
