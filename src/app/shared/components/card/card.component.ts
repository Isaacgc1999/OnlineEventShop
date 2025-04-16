import { Component, input, output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { ButtonComponent } from "../button/button.component";
import { DatePipe } from '@angular/common';
import { Event } from '../../../core/models/event.model';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [MatCardModule, ButtonComponent, DatePipe],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss'
})
export class CardComponent {

  readonly event = input<Event>();
  readonly click = output<void>();

  onClick(){
    this.click.emit();
  }
}
