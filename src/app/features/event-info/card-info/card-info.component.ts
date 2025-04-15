import { CommonModule, DatePipe } from '@angular/common';
import { Component, EventEmitter, inject, input, Output, output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { NumberInputComponent } from '../../../shared/components/number-input/number-input.component';
import { FormsModule } from '@angular/forms';
import { Session } from '../../../core/models/event-info.model';
import { CatalogueService } from '../../../core/services/catalogue/catalogue.service';
import { Subject, takeUntil } from 'rxjs';
import { CartService } from '../../../core/services/cart/cart.service';
import { CartItem } from '../../../core/models/cart.model';


@Component({
  selector: 'app-card-info',
  standalone: true,
  imports: [DatePipe,
    NumberInputComponent,
    FormsModule,
    CommonModule,
    MatCardModule],
  templateUrl: './card-info.component.html',
  styleUrl: './card-info.component.scss'
})
export class CardInfoComponent {
  private catalogueService = inject(CatalogueService);
  private cartService = inject(CartService);

  private readonly destroy$ = new Subject<void>();
  isLoading: boolean = true;

  readonly eventId = input<string | null>();
  eventInfo?: Session[];
  selectedTickets: { [sessionId: string]: number } = {};

  savedCartItems: CartItem[] = [];
  
  ngOnInit(){
    const saved = localStorage.getItem('cartItems');
    try {
      const parsed = saved ? JSON.parse(saved) : [];
      this.savedCartItems = Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error('Error parsing cartItems from localStorage:', error);
      this.savedCartItems = [];
    }
  
    const eventId = this.eventId();
    if (eventId) {
      this.loadEventDetails(eventId);
    }
  }

  getRealInfo(){
    this.eventInfo?.forEach((session) => {
      const savedItem = this.savedCartItems.find(item => item.session.date === session.date);
      if (savedItem) {
        session.availability = (Number(session.availability) - savedItem.ticketQuantity).toString();
      } else {
        this.selectedTickets[session.date] = 0;
      }
    });
  }

  loadEventDetails(id: string): void {
    this.catalogueService.getEventDetails(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (details) => {
          this.eventInfo = details.sessions.sort((a, b) => Number(a.date) - Number(b.date));
          this.cartService.setEventInfo(details);
          this.getRealInfo();
          this.isLoading = false;
        },
        error: (error) => {
          console.error('EVENT INFO NOT FOUND:', error);
          this.eventInfo = []; 
          this.isLoading = false;
        }
      });
  }

  onChangedValue(newValue: number, session: Session) {
    const previousValue = this.selectedTickets[session.date] || 0;
    const quantityChange = newValue - previousValue;
    this.selectedTickets[session.date] = newValue;
    this.cartService.addItemToCart(session.date, quantityChange);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
