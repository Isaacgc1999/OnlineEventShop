import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { CardInfoComponent } from './card-info/card-info.component';
import { CartComponent } from '../../shared/components/cart/cart.component';
import { CatalogueService } from '../../core/services/catalogue/catalogue.service';
import { CartService } from '../../core/services/cart/cart.service';
import { Event } from '../../core/models/event.model';

@Component({
  selector: 'app-event-info',
  standalone: true,
  imports: [CardInfoComponent, CartComponent, RouterLink, DatePipe, TitleCasePipe],
  templateUrl: './event-info.component.html',
  styleUrl: './event-info.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EventInfoComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private catalogueService = inject(CatalogueService);
  private cartService = inject(CartService);
  eventId: string | null = this.route.snapshot.paramMap.get('id');
  readonly event = signal<Event | null>(null);
  private readonly destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe(params => {
      this.eventId = params.get('id');
      if (this.eventId) {
        this.cartService.setCurrentEventId(this.eventId);
        this.getEvent(this.eventId);
      }
    });
  }

  getEvent(id: string): void {
    this.catalogueService.getEventById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (events) => this.event.set(events[0] ?? null),
        error: (error) => console.error('Error loading event:', error)
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
