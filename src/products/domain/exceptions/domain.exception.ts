export class DomainException extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class InvalidPriceException extends DomainException {
  constructor(message: string = 'Price must be greater than zero') {
    super(message);
  }
}

export class InsufficientStockException extends DomainException {
  constructor(
    available: number,
    requested: number,
  ) {
    super(
      `Insufficient stock: requested ${requested}, but only ${available} available`,
    );
  }
}

export class InvalidStockException extends DomainException {
  constructor(message: string = 'Stock quantity cannot be negative') {
    super(message);
  }
}
