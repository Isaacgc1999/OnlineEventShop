import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Event } from '../../../core/models/event.model';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [DatePipe, TitleCasePipe, RouterLink],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardComponent {
  readonly event = input.required<Event>();
}
