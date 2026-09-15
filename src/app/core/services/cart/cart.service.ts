import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, take } from 'rxjs';
import { CartItem, EventCart } from '../../models/cart.model';
import { EventInfo, Session } from '../../models/event-info.model';

const STORAGE_KEY = 'cartByEventItems';

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

  constructor(){
    const storedCartEventItems = localStorage.getItem(STORAGE_KEY);
    try {
      const parsedCart = JSON.parse(storedCartEventItems || '[]');
      if (Array.isArray(parsedCart)) {
        this.cartByEventItems.next(parsedCart);
      } else {
        console.warn('Invalid cartItems in localStorage, resetting...');
        this.cartByEventItems.next([]);
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch (e) {
      console.error('Error parsing cartItems from localStorage:', e);
      this.cartByEventItems.next([]);
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  setCurrentEventId(eventId: string | null): void {
    this.currentEventId.next(eventId);
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

      this.save(newCartByEvent);
    });
  }

  /** Removes every ticket for one session, and the event itself once it has no sessions left. */
  removeSession(eventId: string, sessionDate: string): void {
    const newCartByEvent = this.cartByEventItems.getValue()
      .map(eventCart => eventCart.eventId === eventId
        ? { ...eventCart, cart: eventCart.cart.filter(item => item.session.date !== sessionDate) }
        : eventCart)
      .filter(eventCart => eventCart.cart.length > 0);

    this.save(newCartByEvent);
  }

  clearCart(): void {
    this.cartByEventItems.next([]);
    localStorage.removeItem(STORAGE_KEY);
  }

  /** Puts back a cart saved before clearing it (used by the Undo toast). */
  restoreCart(cartByEvent: EventCart[]): void {
    this.save(cartByEvent);
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

  private save(cartByEvent: EventCart[]): void {
    this.cartByEventItems.next(cartByEvent);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cartByEvent));
  }
}
