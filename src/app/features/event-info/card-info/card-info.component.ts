import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject, input, output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { NumberInputComponent } from '../../../shared/components/number-input/number-input.component';
import { FormsModule } from '@angular/forms';
import { EventInfo, Session } from '../../../core/models/event-info.model';
import { CatalogueService } from '../../../core/services/catalogue.service';
import { ActivatedRoute } from '@angular/router';
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
  private route = inject(ActivatedRoute);

  private readonly destroy$ = new Subject<void>();


  readonly numInputSelection = output<{num: number, session: Session}>();

  eventId = this.route.snapshot.paramMap.get('id');
  eventInfo?: Session[];

  ngOnInit(){
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe(params => {
      this.eventId = params.get('id');
      console.log('Event ID:', this.eventId);
      if (this.eventId) {
        this.loadEventDetails(this.eventId);
      }
    });
  }

  loadEventDetails(id: string): void {
    this.catalogueService.getEventDetails(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (details) => {
          this.eventInfo = details.sessions.sort((a, b) => Number(a.date) - Number(b.date));
        },
        error: (error) => {
          console.error('Error loading event details:', error);
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
