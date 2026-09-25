import {
  InsufficientStockException,
  InvalidStockException,
} from '../exceptions/domain.exception.js';

export class Stock {
  private readonly _quantity: number;

  private constructor(quantity: number) {
    this._quantity = quantity;
  }

  public static create(quantity: number): Stock {
    if (quantity === undefined || quantity === null || !Number.isInteger(quantity) || quantity < 0) {
      throw new InvalidStockException(
        `Invalid stock: ${quantity}. Stock must be a non-negative integer.`,
      );
    }
    return new Stock(quantity);
  }

  get quantity(): number {
    return this._quantity;
  }

  public isOutOfStock(): boolean {
    return this._quantity === 0;
  }

  public add(amount: number): Stock {
    if (!Number.isInteger(amount) || amount <= 0) {
      throw new InvalidStockException('Amount to add must be a positive integer');
    }
    return new Stock(this._quantity + amount);
  }

  public decrease(amount: number): Stock {
    if (!Number.isInteger(amount) || amount <= 0) {
      throw new InvalidStockException('Amount to decrease must be a positive integer');
    }
    if (this._quantity < amount) {
      throw new InsufficientStockException(this._quantity, amount);
    }
    return new Stock(this._quantity - amount);
  }

  public equals(other: Stock): boolean {
    if (!other) return false;
    return this._quantity === other._quantity;
  }
}
