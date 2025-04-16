import { CommonModule, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { NumberInputComponent } from '../../../shared/components/number-input/number-input.component';
import { FormsModule } from '@angular/forms';
import { Session } from '../../../core/models/event-info.model';
import { CatalogueService } from '../../../core/services/catalogue/catalogue.service';
import { Subject, takeUntil } from 'rxjs';
import { CartService } from '../../../core/services/cart/cart.service';
import { CartItem, EventCart } from '../../../core/models/cart.model';


@Component({
  selector: 'app-card-info',
  standalone: true,
  imports: [DatePipe,
    NumberInputComponent,
    FormsModule,
    CommonModule,
    MatCardModule],
  templateUrl: './card-info.component.html',
  styleUrl: './card-info.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardInfoComponent {
  private catalogueService = inject(CatalogueService);
  private cartService = inject(CartService);
  private cdr = inject(ChangeDetectorRef);
  
  private readonly destroy$ = new Subject<void>();
  isLoading: boolean = true;

  readonly eventId = input<string | null>();
  eventInfo?: Session[];
  selectedTickets: { [sessionId: string]: number } = {};

  savedCartItems: CartItem[] = [];
  savedCartEventItems: EventCart[] = [];

  

  ngOnInit(){
    const eventId = this.eventId();
    if (eventId) {
      this.loadEventDetails(eventId);
    }
    const savedItems = localStorage.getItem('cartByEventItems');
    try {
      const parsedItems = savedItems ? JSON.parse(savedItems) : [];
      this.savedCartEventItems = Array.isArray(parsedItems) ? parsedItems : [];
    } catch (error) {
      console.error('Error parsing cartEventItems from localStorage:', error);
      this.savedCartEventItems = [];
    } 
  }

  getRealInfo(): void{
    this.eventInfo = this.eventInfo?.map(session => {
      const eventCart: EventCart | undefined = this.savedCartEventItems.find(
        eventCartItem => eventCartItem.eventId === this.eventId()
      );

      if(eventCart){
        const cartItem = eventCart.cart.find(item => item.session.date === session.date);

        if(cartItem){
          const currentAvailability = Number(session.availability);
          const ticketsInCart = cartItem.ticketQuantity;
          const updatedAvailability = currentAvailability - ticketsInCart;
          return { ...session, availability: updatedAvailability.toString() };
        }
      }
      return session;
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
          this.cdr.markForCheck()
        },
        error: (error) => {
          console.error('EVENT INFO NOT FOUND:', error);
          this.eventInfo = []; 
          this.isLoading = false;
          this.cdr.markForCheck()
        }
      });
  }

  onChangedValue(valueChange: number, session: Session): void {
    const eventId = this.eventId();
    let baseValue = 0;
  
    const savedItemsRaw = localStorage.getItem('cartByEventItems');
    if (savedItemsRaw) {
      try {
        const savedItems: EventCart[] = JSON.parse(savedItemsRaw);
  
        const eventCart = savedItems.find(item => item.eventId === eventId);
        if (eventCart) {
          const cartItem = eventCart.cart.find(cart => cart.session.date === session.date);
          if (cartItem) {
            baseValue = cartItem.ticketQuantity;
          }
        }
      } catch (error) {
        console.error('Error reading cart from localStorage:', error);
      }
    }
  
    const inMemoryValue = this.selectedTickets[session.date] || 0;
    const currentBase = Math.max(baseValue, inMemoryValue); 
  
    const updatedValue = currentBase + valueChange;
  
    this.selectedTickets = {
      ...this.selectedTickets,
      [session.date]: updatedValue
    };
  
    this.cartService.addEventToCart(session.date, updatedValue);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
