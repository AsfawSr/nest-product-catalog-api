import { Price } from '../value-objects/price.vo.js';
import { Stock } from '../value-objects/stock.vo.js';
import { DomainException } from '../exceptions/domain.exception.js';
import { IDomainEvent } from '../events/domain-event.interface.js';
import { ProductPriceChangedEvent } from '../events/product-price-changed.event.js';
import { ProductStockDepletedEvent } from '../events/product-stock-depleted.event.js';

export interface ProductProperties {
  id?: number;
  name: string;
  description?: string;
  price: Price;
  category: string;
  stock: Stock;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Product {
  private _id?: number;
  private _name: string;
  private _description?: string;
  private _price: Price;
  private _category: string;
  private _stock: Stock;
  private _createdAt: Date;
  private _updatedAt: Date;
  private _domainEvents: IDomainEvent[] = [];

  private constructor(props: ProductProperties) {
    this._id = props.id;
    this._name = props.name;
    this._description = props.description;
    this._price = props.price;
    this._category = props.category;
    this._stock = props.stock;
    this._createdAt = props.createdAt ?? new Date();
    this._updatedAt = props.updatedAt ?? new Date();
  }

  /**
   * Factory method to create a brand new Product aggregate
   */
  public static create(props: {
    name: string;
    description?: string;
    price: number;
    category: string;
    stock: number;
  }): Product {
    if (!props.name || props.name.trim().length < 3) {
      throw new DomainException('Product name must have at least 3 characters');
    }
    if (!props.category || props.category.trim().length === 0) {
      throw new DomainException('Product category is required');
    }

    const priceVO = Price.create(props.price);
    const stockVO = Stock.create(props.stock);

    return new Product({
      name: props.name.trim(),
      description: props.description?.trim(),
      price: priceVO,
      category: props.category.trim(),
      stock: stockVO,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  /**
   * Reconstitute an existing Product from persistence without creation logic
   */
  public static reconstitute(props: ProductProperties): Product {
    return new Product(props);
  }

  // Domain Event Management
  public addDomainEvent(event: IDomainEvent): void {
    this._domainEvents.push(event);
  }

  public pullDomainEvents(): IDomainEvent[] {
    const events = [...this._domainEvents];
    this._domainEvents = [];
    return events;
  }

  // Business methods enforcing invariants & recording events
  public changePrice(newPrice: number): void {
    const oldPrice = this._price.value;
    this._price = Price.create(newPrice);
    this._updatedAt = new Date();

    if (this._id && oldPrice !== this._price.value) {
      this.addDomainEvent(
        new ProductPriceChangedEvent(this._id, oldPrice, this._price.value),
      );
    }
  }

  public addStock(amount: number): void {
    this._stock = this._stock.add(amount);
    this._updatedAt = new Date();
  }

  public decreaseStock(amount: number): void {
    this._stock = this._stock.decrease(amount);
    this._updatedAt = new Date();

    if (this._stock.isOutOfStock()) {
      this.addDomainEvent(
        new ProductStockDepletedEvent(this._id ?? 0, this._name),
      );
    }
  }

  public updateDetails(name?: string, description?: string, category?: string): void {
    if (name !== undefined) {
      if (name.trim().length < 3) {
        throw new DomainException('Product name must have at least 3 characters');
      }
      this._name = name.trim();
    }

    if (description !== undefined) {
      this._description = description.trim();
    }

    if (category !== undefined) {
      if (category.trim().length === 0) {
        throw new DomainException('Product category cannot be empty');
      }
      this._category = category.trim();
    }

    this._updatedAt = new Date();
  }

  // Getters - Domain state is read-only from the outside
  get id(): number | undefined {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get description(): string | undefined {
    return this._description;
  }

  get price(): Price {
    return this._price;
  }

  get category(): string {
    return this._category;
  }

  get stock(): Stock {
    return this._stock;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }
}
