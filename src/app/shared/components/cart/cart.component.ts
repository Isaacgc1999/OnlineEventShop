import { CommonModule, DatePipe } from '@angular/common';
import { Component, output } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { CartService } from '../../../core/services/cart/cart.service';
import { CartItem, EventCart } from '../../../core/models/cart.model';
import { MatCardModule } from '@angular/material/card';
import { MatIconButton } from '@angular/material/button';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [DatePipe, MatCardModule, MatIconButton, CommonModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent {
  cartItemsByEvent: EventCart[] = [];
  sessions?: CartItem;
  eventTitle: string = '';
  private readonly destroy$ = new Subject<void>();

  constructor(private cartService: CartService) { }

  ngOnInit(): void {
    this.cartService.cartByEventItems$.pipe(takeUntil(this.destroy$)).subscribe(items => {
      if(items && items.length > 0) {
        this.cartItemsByEvent = items ?? [];
      }
    });
  }

  removeEvent(id: string, sessionDate: string): void {
    this.cartService.removeItemFromCart(id, sessionDate);
  }

  totalTickets(): number {
    return this.cartService.getTotalTickets();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
