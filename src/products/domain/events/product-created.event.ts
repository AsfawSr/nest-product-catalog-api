import { IDomainEvent } from './domain-event.interface.js';

export class ProductCreatedEvent implements IDomainEvent {
  public readonly occurredOn: Date;
  public readonly eventName = 'product.created';

  constructor(
    public readonly productId: number,
    public readonly name: string,
    public readonly price: number,
    public readonly category: string,
    public readonly stock: number,
  ) {
    this.occurredOn = new Date();
  }
}
