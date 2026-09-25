import { describe, it, expect } from 'vitest';
import { ProductMapper } from './product.mapper.js';
import { ProductOrmEntity } from './product.orm-entity.js';
import { Product } from '../../domain/models/product.model.js';

describe('ProductMapper', () => {
  it('should map ProductOrmEntity to Domain Product', () => {
    const orm = new ProductOrmEntity();
    orm.id = 1;
    orm.name = 'Mechanical Keyboard';
    orm.description = 'Blue switches';
    orm.price = 129.99;
    orm.category = 'Electronics';
    orm.stock = 15;
    orm.createdAt = new Date();
    orm.updatedAt = new Date();

    const domain = ProductMapper.toDomain(orm);

    expect(domain.id).toBe(1);
    expect(domain.name).toBe('Mechanical Keyboard');
    expect(domain.price.value).toBe(129.99);
    expect(domain.stock.quantity).toBe(15);
    expect(domain.category).toBe('Electronics');
  });

  it('should map Domain Product to ProductOrmEntity', () => {
    const domain = Product.create({
      name: 'Wireless Mouse',
      description: 'Ergonomic shape',
      price: 59.5,
      category: 'Electronics',
      stock: 30,
    });

    const orm = ProductMapper.toOrm(domain);

    expect(orm.name).toBe('Wireless Mouse');
    expect(orm.description).toBe('Ergonomic shape');
    expect(orm.price).toBe(59.5);
    expect(orm.category).toBe('Electronics');
    expect(orm.stock).toBe(30);
  });
});
