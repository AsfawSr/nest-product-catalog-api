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

  it('should successfully add and decrease stock within limits', () => {
    const product = Product.create({
      name: 'Gaming Headset',
      price: 79.99,
      category: 'Electronics',
      stock: 10,
    });

    product.addStock(5);
    expect(product.stock.quantity).toBe(15);

    product.decreaseStock(8);
    expect(product.stock.quantity).toBe(7);
  });

  it('should update price and details using business methods', () => {
    const product = Product.create({
      name: 'USB-C Cable',
      price: 9.99,
      category: 'Accessories',
      stock: 50,
    });

    product.changePrice(14.5);
    expect(product.price.value).toBe(14.5);

    product.updateDetails('USB-C 100W Fast Cable', 'Braided nylon cable', 'Cables');
    expect(product.name).toBe('USB-C 100W Fast Cable');
    expect(product.description).toBe('Braided nylon cable');
    expect(product.category).toBe('Cables');
  });

  it('should enforce name length rule', () => {
    expect(() => {
      Product.create({
        name: 'AB',
        price: 10,
        category: 'Misc',
        stock: 1,
      });
    }).toThrow(DomainException);
  });
});
