import { Component} from '@angular/core';
import { Session } from '../../core/models/event-info.model';
import { CardInfoComponent } from './card-info/card-info.component';

@Component({
  selector: 'app-event-info',
  standalone: true,
  imports: [CardInfoComponent],
  templateUrl: './event-info.component.html',
  styleUrl: './event-info.component.scss'
})
export class EventInfoComponent{

  getInputNum({num, session}: {num: number, session: Session}) {
    console.log('Selected number:', num, 'for session:', session);
  }
}
