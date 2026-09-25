import { describe, it, expect, vi } from 'vitest';
import { ProductEventsListener } from './product-events.listener.js';
import { ProductCreatedEvent } from '../../domain/events/product-created.event.js';
import { ProductPriceChangedEvent } from '../../domain/events/product-price-changed.event.js';
import { ProductStockDepletedEvent } from '../../domain/events/product-stock-depleted.event.js';

describe('ProductEventsListener', () => {
  const listener = new ProductEventsListener();

  it('should handle ProductCreatedEvent without error', () => {
    const event = new ProductCreatedEvent(1, 'Gaming Monitor', 299.99, 'Electronics', 15);
    expect(() => listener.handleProductCreated(event)).not.toThrow();
  });

  it('should handle ProductPriceChangedEvent without error', () => {
    const event = new ProductPriceChangedEvent(1, 299.99, 249.99);
    expect(() => listener.handlePriceChanged(event)).not.toThrow();
  });

  it('should handle ProductStockDepletedEvent without error', () => {
    const event = new ProductStockDepletedEvent(1, 'Gaming Monitor');
    expect(() => listener.handleStockDepleted(event)).not.toThrow();
  });
});
