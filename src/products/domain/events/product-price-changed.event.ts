import { IDomainEvent } from './domain-event.interface.js';

export class ProductPriceChangedEvent implements IDomainEvent {
  public readonly occurredOn: Date;
  public readonly eventName = 'product.price.changed';

  constructor(
    public readonly productId: number,
    public readonly oldPrice: number,
    public readonly newPrice: number,
  ) {
    this.occurredOn = new Date();
  }
}
