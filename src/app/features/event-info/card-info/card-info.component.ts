import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input, OnDestroy, OnInit, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Subject, takeUntil } from 'rxjs';
import { NumberInputComponent } from '../../../shared/components/number-input/number-input.component';
import { Session } from '../../../core/models/event-info.model';
import { EventCart } from '../../../core/models/cart.model';
import { CatalogueService } from '../../../core/services/catalogue/catalogue.service';
import { CartService } from '../../../core/services/cart/cart.service';
import { AvailabilityStatus, SessionRow } from '../../../core/models/session-row.model';

export function availabilityStatus(remaining: number, inCart: number): AvailabilityStatus {
  if (remaining <= 0) {
    return inCart > 0
      ? { tone: 'success', label: 'All in your cart' }
      : { tone: 'muted', label: 'Sold out' };
  }
  if (remaining === 1) {
    return { tone: 'warning', label: 'Last ticket' };
  }
  if (remaining <= 3) {
    return { tone: 'warning', label: `Only ${remaining} left` };
  }
  return { tone: 'neutral', label: `${remaining} available` };
}

@Component({
  selector: 'app-card-info',
  standalone: true,
  imports: [DatePipe, NumberInputComponent],
  templateUrl: './card-info.component.html',
  styleUrl: './card-info.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardInfoComponent implements OnInit, OnDestroy {
  private catalogueService = inject(CatalogueService);
  private cartService = inject(CartService);
  private readonly destroy$ = new Subject<void>();

  readonly eventId = input<string | null>();

  /** null while loading. */
  readonly sessions = signal<Session[] | null>(null);
  readonly loadFailed = signal(false);
  private readonly cart = toSignal(this.cartService.cartByEventItems$, { initialValue: [] as EventCart[] });

  readonly rows = computed<SessionRow[]>(() => {
    const eventCart = this.cart().find(item => item.eventId === this.eventId());
    return (this.sessions() ?? []).map(session => {
      const available = Number(session.availability);
      const inCart = eventCart?.cart.find(item => item.session.date === session.date)?.ticketQuantity ?? 0;
      const remaining = Math.max(0, available - inCart);
      return { session, available, inCart, remaining, status: availabilityStatus(remaining, inCart) };
    });
  });

  protected readonly skeletonRows = [1, 2, 3];

  ngOnInit(): void {
    const eventId = this.eventId();
    if (eventId) {
      this.loadEventDetails(eventId);
    }
  }

  loadEventDetails(id: string): void {
    this.catalogueService.getEventDetails(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (details) => {
          this.sessions.set([...details.sessions].sort((a, b) => Number(a.date) - Number(b.date)));
          this.cartService.setEventInfo(details);
        },
        error: (error) => {
          console.error('EVENT INFO NOT FOUND:', error);
          this.sessions.set([]);
          this.loadFailed.set(true);
        }
      });
  }

  onQuantityChange(session: Session, quantity: number): void {
    this.cartService.addEventToCart(session.date, quantity);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
