import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ProductCreatedEvent } from '../../domain/events/product-created.event.js';
import { ProductPriceChangedEvent } from '../../domain/events/product-price-changed.event.js';
import { ProductStockDepletedEvent } from '../../domain/events/product-stock-depleted.event.js';

@Injectable()
export class ProductEventsListener {
  private readonly logger = new Logger(ProductEventsListener.name);

  @OnEvent('product.created')
  handleProductCreated(event: ProductCreatedEvent) {
    this.logger.log(
      `🎉 [Audit Event] Product created: #${event.productId} "${event.name}" ($${event.price}) in [${event.category}]`,
    );
  }

  @OnEvent('product.price.changed')
  handlePriceChanged(event: ProductPriceChangedEvent) {
    this.logger.warn(
      `📈 [Price Audit] Product #${event.productId} price adjusted: $${event.oldPrice} ➔ $${event.newPrice}`,
    );
  }

  @OnEvent('product.stock.depleted')
  handleStockDepleted(event: ProductStockDepletedEvent) {
    this.logger.error(
      `🚨 [INVENTORY ALERT] Product #${event.productId} "${event.name}" is now OUT OF STOCK! Supplier notification dispatched.`,
    );
  }
}
