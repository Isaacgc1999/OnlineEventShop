import { Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-button',
  imports: [MatButtonModule],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss'
})
export class ButtonComponent {
  readonly text = input<string>();
  readonly onClick = output<void>();
  readonly isDisabled = input<boolean>(false);

  click() {
    this.onClick.emit();
  }
}
