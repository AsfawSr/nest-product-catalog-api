import { describe, it, expect } from 'vitest';
import { Product } from './product.model.js';
import { Price } from '../value-objects/price.vo.js';
import { Stock } from '../value-objects/stock.vo.js';
import {
  DomainException,
  InsufficientStockException,
  InvalidPriceException,
  InvalidStockException,
} from '../exceptions/domain.exception.js';
import { ProductPriceChangedEvent } from '../events/product-price-changed.event.js';
import { ProductStockDepletedEvent } from '../events/product-stock-depleted.event.js';

describe('Product Aggregate Root (Domain)', () => {
  it('should create a valid product', () => {
    const product = Product.create({
      name: 'Mechanical Keyboard',
      description: 'Tactile blue switch',
      price: 99.99,
      category: 'Electronics',
      stock: 10,
    });

    expect(product.name).toBe('Mechanical Keyboard');
    expect(product.price.value).toBe(99.99);
    expect(product.stock.quantity).toBe(10);
    expect(product.createdAt).toBeInstanceOf(Date);
  });

  it('should throw an error when creating a product with price <= 0', () => {
    expect(() => {
      Product.create({
        name: 'Free Item',
        price: 0,
        category: 'Misc',
        stock: 5,
      });
    }).toThrow(InvalidPriceException);
  });

  it('should throw an error when decreasing stock beyond available quantity', () => {
    const product = Product.create({
      name: 'Wireless Mouse',
      price: 49.99,
      category: 'Electronics',
      stock: 5,
    });

    expect(() => {
      product.decreaseStock(10);
    }).toThrow(InsufficientStockException);
  });

  it('should record ProductStockDepletedEvent when stock drops to zero', () => {
    const product = Product.reconstitute({
      id: 5,
      name: 'Limited Edition Keycap',
      price: Price.create(35.0),
      category: 'Accessories',
      stock: Stock.create(3),
    });

    product.decreaseStock(3);
    expect(product.stock.isOutOfStock()).toBe(true);

    const events = product.pullDomainEvents();
    expect(events.length).toBe(1);
    expect(events[0]).toBeInstanceOf(ProductStockDepletedEvent);
    expect((events[0] as ProductStockDepletedEvent).productId).toBe(5);
  });

  it('should record ProductPriceChangedEvent when price is altered', () => {
    const product = Product.reconstitute({
      id: 8,
      name: 'Gaming Mouse',
      price: Price.create(50.0),
      category: 'Electronics',
      stock: Stock.create(10),
    });

    product.changePrice(45.0);
    expect(product.price.value).toBe(45.0);

    const events = product.pullDomainEvents();
    expect(events.length).toBe(1);
    expect(events[0]).toBeInstanceOf(ProductPriceChangedEvent);
    const event = events[0] as ProductPriceChangedEvent;
    expect(event.oldPrice).toBe(50.0);
    expect(event.newPrice).toBe(45.0);
  });

  it('should clear pulled domain events after pulling', () => {
    const product = Product.reconstitute({
      id: 9,
      name: 'Desk Mat',
      price: Price.create(25.0),
      category: 'Accessories',
      stock: Stock.create(1),
    });

    product.changePrice(20.0);
    expect(product.pullDomainEvents().length).toBe(1);
    expect(product.pullDomainEvents().length).toBe(0); // empty now
  });
});
