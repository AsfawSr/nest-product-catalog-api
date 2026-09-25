import { IDomainEvent } from './domain-event.interface.js';

export class ProductStockDepletedEvent implements IDomainEvent {
  public readonly occurredOn: Date;
  public readonly eventName = 'product.stock.depleted';

  constructor(
    public readonly productId: number,
    public readonly name: string,
  ) {
    this.occurredOn = new Date();
  }
}
