import { Product } from '../../domain/models/product.model.js';
import { Price } from '../../domain/value-objects/price.vo.js';
import { Stock } from '../../domain/value-objects/stock.vo.js';
import { ProductOrmEntity } from './product.orm-entity.js';

export class ProductMapper {
  /**
   * Convert database ORM entity to pure domain Aggregate Root
   */
  public static toDomain(orm: ProductOrmEntity): Product {
    return Product.reconstitute({
      id: orm.id,
      name: orm.name,
      description: orm.description,
      price: Price.create(orm.price),
      category: orm.category,
      stock: Stock.create(orm.stock),
      createdAt: orm.createdAt,
      updatedAt: orm.updatedAt,
    });
  }

  /**
   * Convert pure domain Aggregate Root to database ORM entity for persistence
   */
  public static toOrm(domain: Product): ProductOrmEntity {
    const orm = new ProductOrmEntity();
    if (domain.id !== undefined) {
      orm.id = domain.id;
    }
    orm.name = domain.name;
    orm.description = domain.description;
    orm.price = domain.price.value;
    orm.category = domain.category;
    orm.stock = domain.stock.quantity;
    orm.createdAt = domain.createdAt;
    orm.updatedAt = domain.updatedAt;
    return orm;
  }
}
