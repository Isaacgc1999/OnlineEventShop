import { DatePipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { EventInfo } from '../../../core/models/event-info.model';
import { Subject, takeUntil } from 'rxjs';
import { CartService } from '../../../core/services/cart/cart.service';
import { CartItem } from '../../../core/models/cart.model';
import { MatCard } from '@angular/material/card';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [DatePipe, MatCard],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent {
  cartItems: CartItem[] = [];
  eventTitle: string = '';
  private readonly destroy$ = new Subject<void>();

  constructor(private cartService: CartService) { }

  ngOnInit(): void {
    this.cartService.cartItems$.pipe(takeUntil(this.destroy$)).subscribe(items => {
      this.cartItems = items;
    });

    this.cartService.eventInfo$.pipe(takeUntil(this.destroy$)).subscribe(eventInfo => {
      this.eventTitle = eventInfo?.event?.title || '';
    });
  }

  removeEvent(sessionDate: string): void {
    this.cartService.removeItemFromCart(sessionDate);
  }

  get totalTickets(): number {
    return this.cartService.getTotalTickets();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
