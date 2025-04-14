import { Component, inject, OnInit } from '@angular/core';
import { CardComponent } from "../../shared/components/card/card.component";
import { CatalogueService } from '../../core/services/catalogue/catalogue.service';
import { Event } from '../../core/models/event.model';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-catalogue',
  standalone: true,
  imports: [CardComponent],
  templateUrl: './catalogue.component.html',
  styleUrl: './catalogue.component.scss'
})
export class CatalogueComponent  implements OnInit{
  private catalogueService = inject(CatalogueService);
  private router = inject(Router);
  events: Event[] = [];
  private readonly destroy$ = new Subject<void>();

  ngOnInit(){
    this.catalogueService.getEvents()
    .pipe(takeUntil(this.destroy$))
    .subscribe((events) => {
      this.events = events.sort((a, b) => Number(a.endDate) - Number(b.endDate));
    });
  }

  onCardClick(id: string) {
    this.router.navigate(['/event', id]);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
