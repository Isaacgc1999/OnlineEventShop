import { Component, input, output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-number-input',
  standalone: true,
  imports: [],
  templateUrl: './number-input.component.html',
  styleUrl: './number-input.component.scss'
})
export class NumberInputComponent {
  readonly maxValue = input<string|null>(null);
  readonly valueChange = output<number>();

  currentValue: number = 0;

  ngOnInit(): void {
    this.emitValue();
  }

  reset(): void {
    this.currentValue = 0;
    this.emitValue();
  }

  ngOnChanges(changes: SimpleChanges): void {
    const currentMaxValue = Number(this.maxValue());
    if (changes['maxValue']) {
      if (currentMaxValue !== null && this.currentValue > currentMaxValue) {
        this.currentValue = currentMaxValue;
        
        this.emitValue();
      }
    }
  }

  increment(): void {
    const currentMaxValue = Number(this.maxValue());
    if (currentMaxValue === null || this.currentValue < currentMaxValue) {
      this.currentValue++;
      this.emitValue();
    }
  }

  decrement(): void {
    if (this.currentValue > 0) {
      this.currentValue--;
      this.emitValue();
    }
  }

  private emitValue(): void {
    this.valueChange.emit(this.currentValue);
  }
}
