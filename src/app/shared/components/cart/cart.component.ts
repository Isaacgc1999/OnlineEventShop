import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, output } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { CartService } from '../../../core/services/cart/cart.service';
import { CartItem, EventCart } from '../../../core/models/cart.model';
import { MatCardModule } from '@angular/material/card';
import { MatIconButton } from '@angular/material/button';
import { ButtonComponent } from "../button/button.component";

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [DatePipe, MatCardModule, MatIconButton, CommonModule, ButtonComponent],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit, OnDestroy {
  cartItemsByEvent: EventCart[] = [];
  sessions?: CartItem;
  eventTitle: string = '';
  private readonly destroy$ = new Subject<void>();
  private cartService = inject(CartService);

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

  clearCart(): void{
    this.cartService.clearCart();
    window.location.reload();
  }
}
