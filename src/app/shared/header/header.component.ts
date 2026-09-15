import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterModule } from '@angular/router';
import { CartService } from '../../core/services/cart/cart.service';
import { EventCart } from '../../core/models/cart.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {
  private cartService = inject(CartService);
  private readonly cart = toSignal(this.cartService.cartByEventItems$, { initialValue: [] as EventCart[] });

  readonly totalTickets = computed(() =>
    this.cart().reduce((total, eventCart) =>
      total + eventCart.cart.reduce((sum, item) => sum + item.ticketQuantity, 0), 0)
  );

  /** The cart lives on the event page, so the cart button opens the most recent event with tickets. */
  readonly cartEventId = computed(() =>
    [...this.cart()].reverse().find(eventCart => eventCart.cart.length > 0)?.eventId ?? null
  );
}
