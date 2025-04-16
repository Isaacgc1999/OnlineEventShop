import { Component, inject} from '@angular/core';
import { CardInfoComponent } from './card-info/card-info.component';
import { CartComponent } from "../../shared/components/cart/cart.component";
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { CatalogueService } from '../../core/services/catalogue/catalogue.service';
import { EventInfo } from '../../core/models/event-info.model';
import { CartService } from '../../core/services/cart/cart.service';

@Component({
  selector: 'app-event-info',
  standalone: true,
  imports: [CardInfoComponent, CartComponent],
  templateUrl: './event-info.component.html',
  styleUrl: './event-info.component.scss'
})
export class EventInfoComponent{
  private route = inject(ActivatedRoute);
  private catalogueService = inject(CatalogueService);
  private cartService = inject(CartService);
  eventId: string | null = this.route.snapshot.paramMap.get('id');
  eventInfo: EventInfo = {} as EventInfo;
  private readonly destroy$ = new Subject<void>();

  ngOnInit(){
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe(params => {
      this.eventId = params.get('id');
      if(this.eventId) {
        this.cartService.setCurrentEventId(this.eventId);
      }
    });
    if (this.eventId) {
      this.getEventInfo(this.eventId);
    }
  }

  getEventInfo(id: string): void {
    this.catalogueService.getEventDetails(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (details) => {
          this.eventInfo = details;
        },
        error: (error) => {
          console.error('Error loading event details:', error);
        }
      })
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
