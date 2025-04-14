import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CartItem } from '../../models/cart.model';
import { EventInfo } from '../../models/event-info.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems = new BehaviorSubject<CartItem[]>([]);
  readonly cartItems$ = this.cartItems.asObservable();

  private eventInfo = new BehaviorSubject<EventInfo | null>(null);
  readonly eventInfo$ = this.eventInfo.asObservable();

  constructor(){
    const storedCartItems = localStorage.getItem('cartItems');
    if (storedCartItems) {
      this.cartItems.next(JSON.parse(storedCartItems));
    }
    const storedEventInfo = localStorage.getItem('eventInfo');
    if (storedEventInfo) {
      this.eventInfo.next(JSON.parse(storedEventInfo));
    }
  }

  setEventInfo(eventInfo: EventInfo): void {
    this.eventInfo.next(eventInfo);
  }

  addItemToCart(sessionDate: string, quantityTickets: number): void {
    const currentCart = this.cartItems.getValue();
    const existingItemIndex = currentCart.findIndex(item => item.session.date === sessionDate);
    const eventDetails = this.eventInfo.getValue();
    const sessionToAdd = eventDetails?.sessions.find(s => s.date === sessionDate);
  
    if (!sessionToAdd) return;
  
    if (existingItemIndex !== -1) {
      const existingItem = currentCart[existingItemIndex];
      existingItem.ticketQuantity += quantityTickets;
  
      if (existingItem.ticketQuantity <= 0) {
        currentCart.splice(existingItemIndex, 1); 
      }
    } else if (quantityTickets > 0) {
      currentCart.push({ session: sessionToAdd, ticketQuantity: quantityTickets });
    }
  
    this.cartItems.next([...currentCart]);
    localStorage.setItem('cartItems', JSON.stringify(currentCart));
  
    localStorage.setItem('eventInfo', JSON.stringify(eventDetails)); 
    // setTimeout(() => {
    //   this.updateAvailability(sessionDate, -quantityTickets);
    // }, 0); 
  }

  removeItemFromCart(sessionDate: string): void {
    const currentCart = this.cartItems.getValue();
    const existingItemIndex = currentCart.findIndex(item => item.session.date === sessionDate);
  
    if (existingItemIndex !== -1) {
      const existingItem = currentCart[existingItemIndex];
      existingItem.ticketQuantity -= 1;
  
      if (existingItem.ticketQuantity <= 0) {
        currentCart.splice(existingItemIndex, 1);
      }
  
      this.cartItems.next([...currentCart]);
      localStorage.setItem('cartItems', JSON.stringify(currentCart));
  
      this.updateAvailability(sessionDate, +1);
    }
  }

  clearCart(): void {
    const currentCart = this.cartItems.getValue();
    currentCart.forEach(item => this.updateAvailability(item.session.date, item.ticketQuantity));
    this.cartItems.next([]);
  }

  private updateAvailability(sessionDate: string, quantityChange: number): void {
    const currentEventInfo = this.eventInfo.getValue();
    if (currentEventInfo && currentEventInfo.sessions) {
      const sessionToUpdate = currentEventInfo.sessions.find(s => s.date === sessionDate);
      if (sessionToUpdate) {
        const newAvailability = Number(sessionToUpdate.availability) + quantityChange;
        sessionToUpdate.availability = Math.max(0, newAvailability).toString();
        this.eventInfo.next({ ...currentEventInfo });
      }
    }
  }

  getTotalTickets(): number {
    return this.cartItems.getValue().reduce((total, item) => total + item.ticketQuantity, 0);
  }
}
