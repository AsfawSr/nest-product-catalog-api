import { InvalidPriceException } from '../exceptions/domain.exception.js';

export class Price {
  private readonly _value: number;

  private constructor(value: number) {
    this._value = Math.round(value * 100) / 100;
  }

  public static create(value: number): Price {
    if (value === undefined || value === null || isNaN(value) || value <= 0) {
      throw new InvalidPriceException(
        `Invalid price: ${value}. Price must be a positive number greater than 0.`,
      );
    }
    return new Price(value);
  }

  get value(): number {
    return this._value;
  }

  public equals(other: Price): boolean {
    if (!other) return false;
    return this._value === other._value;
  }

  public toString(): string {
    return `$${this._value.toFixed(2)}`;
  }
}
