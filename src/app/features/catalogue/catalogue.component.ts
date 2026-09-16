import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, map, of } from 'rxjs';
import { CardComponent } from '../../shared/components/card/card.component';
import { CatalogueService } from '../../core/services/catalogue/catalogue.service';
import { CatalogueState } from '../../core/models/catalogue-state.model';

@Component({
  selector: 'app-catalogue',
  standalone: true,
  imports: [CardComponent],
  templateUrl: './catalogue.component.html',
  styleUrl: './catalogue.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CatalogueComponent {
  private catalogueService = inject(CatalogueService);

  readonly state = toSignal(
    this.catalogueService.getEvents().pipe(
      map((events): CatalogueState => ({
        status: 'ready',
        events: [...events].sort((a, b) => Number(a.endDate) - Number(b.endDate))
      })),
      catchError(() => of<CatalogueState>({ status: 'error', events: [] }))
    ),
    { initialValue: { status: 'loading', events: [] } as CatalogueState }
  );

  protected readonly skeletonCards = [1, 2, 3, 4];
}
