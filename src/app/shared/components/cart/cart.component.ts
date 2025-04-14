import { DatePipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { EventInfo } from '../../../core/models/event-info.model';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent {
  readonly eventsInCart = input.required<EventInfo>();

  removeEvent(eventIndex: string, sessionIndex: number): void {
    const session = this.eventsInCart().sessions[Number(eventIndex)];
    let quantity = +session.availability;

    if (quantity > 1) {
      session.availability = (quantity - 1).toString();
    } else {
      this.eventsInCart().sessions.splice(sessionIndex, 1);
      if (this.eventsInCart().sessions.length === 0) {
        this.eventsInCart().sessions.splice(Number(eventIndex), 1);
      }
    }
  }

  get totalTickets(): number {
    return this.eventsInCart().sessions.reduce((acc, event) => {
      return acc + (+event.availability || 0);
        }, 0)
  }
}
