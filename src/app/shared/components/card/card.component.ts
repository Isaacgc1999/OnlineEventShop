import { Component, input, output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { ButtonComponent } from "../button/button.component";
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [MatCardModule, ButtonComponent, DatePipe],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss'
})
export class CardComponent {

  //cambiarlo a event
  readonly event = input<Event>();
  readonly title = input<string>();
  readonly subtitle = input<string>();
  readonly description = input<string>();
  readonly image = input<string>();
  readonly startDate = input<string>();
  readonly endDate = input<string>();
  readonly click = output<void>();

  onClick(){
    this.click.emit();
  }
}
