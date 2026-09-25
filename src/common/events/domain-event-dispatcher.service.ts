import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { IDomainEvent } from '../../products/domain/events/domain-event.interface.js';

@Injectable()
export class DomainEventDispatcher {
  private readonly logger = new Logger(DomainEventDispatcher.name);

  constructor(private readonly eventEmitter: EventEmitter2) {}

  dispatch(events: IDomainEvent[]): void {
    for (const event of events) {
      this.logger.log(
        `[Domain Event] Dispatched: ${event.eventName}`,
      );
      this.eventEmitter.emit(event.eventName, event);
    }
  }
}
