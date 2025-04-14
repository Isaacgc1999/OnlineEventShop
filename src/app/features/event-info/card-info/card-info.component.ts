import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject, input, output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { NumberInputComponent } from '../../../shared/components/number-input/number-input.component';
import { FormsModule } from '@angular/forms';
import { Session } from '../../../core/models/event-info.model';
import { CatalogueService } from '../../../core/services/catalogue.service';
import { Subject, takeUntil } from 'rxjs';


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

  private readonly destroy$ = new Subject<void>();
  isLoading: boolean = true;

  readonly numInputSelection = output<{num: number, session: Session}>();
  readonly eventId = input<string | null>();
  eventInfo?: Session[];

  ngOnInit(){
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
          this.eventInfo = details.sessions.sort((a, b) => Number(a.date) - Number(b.date));
          this.isLoading = false;
        },
        error: (error) => {
          console.error('EVENT INFO NOT FOUND:', error);
          this.eventInfo = []; 
          this.isLoading = false;
        }
      });
  }

  onChangedValue(num: number, session: Session){
    this.numInputSelection.emit({num, session});
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
