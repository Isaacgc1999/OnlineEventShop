import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, take } from 'rxjs';
import { CartItem, EventCart } from '../../models/cart.model';
import { EventInfo, Session } from '../../models/event-info.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private eventInfo = new BehaviorSubject<EventInfo | null>(null);
  get eventInfo$(): Observable<EventInfo | null> {
    return this.eventInfo.asObservable();
  }

  private cartByEventItems = new BehaviorSubject<EventCart[]>([]);
  get cartByEventItems$(): Observable<EventCart[]> {
    return this.cartByEventItems.asObservable();
  }

  private currentEventId = new BehaviorSubject<string | null>(null);
  get currentEventId$(): Observable<string | null> {
    return this.currentEventId.asObservable();
  }

  setCurrentEventId(eventId: string | null): void {
    this.currentEventId.next(eventId);
  }

  constructor(){
    const storedCartEventItems = localStorage.getItem('cartByEventItems');
    try {
      const parsedCart = JSON.parse(storedCartEventItems || '[]');
      if (Array.isArray(parsedCart)) {
        this.cartByEventItems.next(parsedCart);
        console.log("localStorage",parsedCart);
      } else {
        console.warn('Invalid cartItems in localStorage, resetting...');
        this.cartByEventItems.next([]);
        localStorage.removeItem('cartByEventItems');
      }
    } catch (e) {
      console.error('Error parsing cartItems from localStorage:', e);
      this.cartByEventItems.next([]);
      localStorage.removeItem('cartByEventItems');
    }
  }

  setEventInfo(eventInfo: EventInfo): void {
    this.eventInfo.next(eventInfo);
  }
  addEventToCart(sessionDate: string, quantityTickets: number): void {
    this.currentEventId.pipe(take(1)).subscribe(eventId => {
      if (!eventId) {
        console.error('No ID was selected.');
        return;
      }
  
      const currentCartByEvent = this.cartByEventItems.getValue();
      const eventInCartIndex = currentCartByEvent.findIndex(item => item.eventId === eventId);
      let eventCart: CartItem[] = [];
  
      if (eventInCartIndex !== -1) {
        eventCart = [...currentCartByEvent[eventInCartIndex].cart];
      }
  
      const eventDetails = this.eventInfo.getValue();
      const sessionToAdd = eventDetails?.sessions.find((s: Session) => s.date === sessionDate);
  
      if (!sessionToAdd) {
        console.warn(`No session was found with that date: ${sessionDate}`);
        return;
      }
  
      const existingItemIndex = eventCart.findIndex(item => item.session.date === sessionDate);
  
      if (existingItemIndex !== -1) {
        const existingItem = eventCart[existingItemIndex];
        existingItem.ticketQuantity = quantityTickets;
  
        if (existingItem.ticketQuantity <= 0) {
          eventCart.splice(existingItemIndex, 1);
        }
      } else if (quantityTickets > 0) {
        eventCart.push({ session: sessionToAdd, ticketQuantity: quantityTickets });
      }
  
      const updatedEventCart: EventCart = { eventId: eventId, eventTitle: eventDetails?.event.title ?? '', cart: eventCart };
      const newCartByEvent = [...currentCartByEvent];
  
      if (eventInCartIndex !== -1) {
        newCartByEvent[eventInCartIndex] = updatedEventCart;
      } else {
        newCartByEvent.push(updatedEventCart);
      }
  
      this.cartByEventItems.next(newCartByEvent);
      localStorage.setItem('cartByEventItems', JSON.stringify(newCartByEvent));
    });
  }

  removeItemFromCart(eventId: string, sessionDate: string): void {
    const currentCartByEvent = this.cartByEventItems.getValue();
    const eventInCartIndex = currentCartByEvent.findIndex(item => item.eventId === eventId);
  
    if (eventInCartIndex !== -1) {
      const eventCart = { ...currentCartByEvent[eventInCartIndex] };
      const itemIndexToRemove = eventCart.cart.findIndex(item => item.session.date === sessionDate);
  
      if (itemIndexToRemove !== -1) {
        const itemToRemove = eventCart.cart[itemIndexToRemove];
  
        if (itemToRemove.ticketQuantity > 1) {
          eventCart.cart[itemIndexToRemove].ticketQuantity -= 1;
        } else {
          eventCart.cart.splice(itemIndexToRemove, 1);
          if (eventCart.cart.length === 0) {
            const newCartByEvent = currentCartByEvent.filter(item => item.eventId !== eventId);
            this.cartByEventItems.next(newCartByEvent);
            localStorage.setItem('cartByEventItems', JSON.stringify(newCartByEvent));
            this.updateAvailability(sessionDate, +1); 
            return;
          }
        }
  
        const newCartByEvent = [...currentCartByEvent];
        newCartByEvent[eventInCartIndex] = eventCart;
  
        this.cartByEventItems.next(newCartByEvent);
        localStorage.setItem('cartByEventItems', JSON.stringify(newCartByEvent));
        this.updateAvailability(sessionDate, +1); 
      } else {
        console.warn(`Session with date ${sessionDate} not found in the cart for event ${eventId}.`);
      }
    } else {
      console.warn(`Cart for event ${eventId} not found.`);
    }
  }

  clearCart(): void {
    const currentCartByEvent = this.cartByEventItems.getValue();

    currentCartByEvent.forEach(eventCart => {
      eventCart.cart.forEach(item => {
        this.updateAvailability(item.session.date, item.ticketQuantity, eventCart.eventId);
      });
    });
  
    this.cartByEventItems.next([]);
    localStorage.removeItem('cartByEventItems');
  }

  private updateAvailability(sessionDate: string, quantityChange: number, eventId?: string): void {
    const currentEventInfo = this.eventInfo.getValue();
    if (currentEventInfo && currentEventInfo.sessions) {
      const sessionToUpdate = currentEventInfo.sessions.find(s => s.date === sessionDate);
  
      if (sessionToUpdate) {
        const currentCartForEvent = this.cartByEventItems.getValue().find(ec => ec.eventId === eventId);
        let ticketsCurrentlyInCartForSession = 0;
  
        if (currentCartForEvent && currentCartForEvent.cart) {
          const cartItem = currentCartForEvent.cart.find(item => item.session.date === sessionDate);
          if (cartItem) {
            ticketsCurrentlyInCartForSession = cartItem.ticketQuantity;
          }
        }
  
        const newAvailability = Number(sessionToUpdate.availability) + quantityChange;
        sessionToUpdate.availability = Math.max(0, newAvailability).toString();
        this.eventInfo.next({ ...currentEventInfo });
      }
    }
  }

  getTotalTickets(): number {
    const currentCart = this.cartByEventItems.getValue();

    if (!Array.isArray(currentCart)) {
      console.error('Cart is not an array:', currentCart);
      return 0;
    }

    let totalTickets = 0;
    currentCart.forEach(eventCart => {
      if (eventCart.cart && Array.isArray(eventCart.cart)) {
          eventCart.cart.forEach(item => {
            totalTickets += item.ticketQuantity; 
          });
      }
    });
  
    return totalTickets;
  }
}
