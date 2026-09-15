import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

@Component({
  selector: 'app-number-input',
  standalone: true,
  imports: [],
  templateUrl: './number-input.component.html',
  styleUrl: './number-input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NumberInputComponent {
  readonly value = input.required<number>();
  readonly min = input(0);
  readonly max = input<number | null>(null);
  /** What the count refers to, e.g. "Thursday, 1 October". Used in the button labels. */
  readonly label = input('');
  readonly valueChange = output<number>();

  readonly canDecrement = computed(() => this.value() > this.min());
  readonly canIncrement = computed(() => {
    const max = this.max();
    return max === null || this.value() < max;
  });
  readonly labelSuffix = computed(() => (this.label() ? ` for ${this.label()}` : ''));

  increment(): void {
    if (this.canIncrement()) {
      this.valueChange.emit(this.value() + 1);
    }
  }

  decrement(): void {
    if (this.canDecrement()) {
      this.valueChange.emit(this.value() - 1);
    }
  }
}
