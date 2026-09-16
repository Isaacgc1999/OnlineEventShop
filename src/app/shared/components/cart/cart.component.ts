import { DatePipe, TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, ElementRef, inject, OnDestroy, signal, viewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { CartService } from '../../../core/services/cart/cart.service';
import { EventCart } from '../../../core/models/cart.model';
import { ButtonComponent } from '../button/button.component';

const UNDO_WINDOW_MS = 6000;

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [DatePipe, TitleCasePipe, ButtonComponent],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CartComponent implements OnDestroy {
  private cartService = inject(CartService);
  private readonly summary = viewChild<ElementRef<HTMLElement>>('summary');
  private undoTimer?: ReturnType<typeof setTimeout>;

  private readonly cart = toSignal(this.cartService.cartByEventItems$, { initialValue: [] as EventCart[] });
  readonly cartItemsByEvent = computed(() => this.cart().filter(eventCart => eventCart.cart.length > 0));
  readonly totalTickets = computed(() =>
    this.cartItemsByEvent().reduce((total, eventCart) =>
      total + eventCart.cart.reduce((sum, item) => sum + item.ticketQuantity, 0), 0)
  );
  /** Cart as it was before "Clear cart", kept while the Undo toast is showing. */
  readonly clearedCart = signal<EventCart[] | null>(null);

  removeSession(eventId: string, sessionDate: string): void {
    this.cartService.removeSession(eventId, sessionDate);
  }

  clearCart(): void {
    this.clearedCart.set(this.cart());
    this.cartService.clearCart();
    clearTimeout(this.undoTimer);
    this.undoTimer = setTimeout(() => this.clearedCart.set(null), UNDO_WINDOW_MS);
  }

  undoClear(): void {
    const clearedCart = this.clearedCart();
    if (clearedCart) {
      this.cartService.restoreCart(clearedCart);
    }
    clearTimeout(this.undoTimer);
    this.clearedCart.set(null);
  }

  reviewCart(): void {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.summary()?.nativeElement.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  }

  ngOnDestroy(): void {
    clearTimeout(this.undoTimer);
  }
}
