import { booleanAttribute, ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ButtonSize, ButtonTone, ButtonType, ButtonVariant } from '../../models/button.model';

@Component({
  selector: 'app-button',
  standalone: true,
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ButtonComponent {
  readonly variant = input<ButtonVariant>('primary');
  readonly size = input<ButtonSize>('md');
  readonly tone = input<ButtonTone>('accent');
  readonly type = input<ButtonType>('button');
  readonly block = input(false, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly loading = input(false, { transform: booleanAttribute });
}
