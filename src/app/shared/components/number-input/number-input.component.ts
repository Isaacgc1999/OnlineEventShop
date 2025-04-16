import { Component, inject, input, OnChanges, OnDestroy, OnInit, output, SimpleChanges } from '@angular/core';
import { CartService } from '../../../core/services/cart/cart.service';
import { EventCart } from '../../../core/models/cart.model';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-number-input',
  standalone: true,
  imports: [],
  templateUrl: './number-input.component.html',
  styleUrl: './number-input.component.scss'
})
export class NumberInputComponent implements OnInit, OnDestroy{
  private cartService = inject(CartService);
  readonly maxValue = input<string|null>(null);
  readonly valueChange = output<number>();

  private readonly destroy$ = new Subject<void>();
  

  currentValue: number = 0;

  ngOnInit(): void {
    this.resetOnCartChange();
  }

  reset(): void {
    this.emitValue(-this.currentValue);
    this.currentValue = 0;
  }

  // ngOnChanges(changes: SimpleChanges): void {
  //   const currentMaxValue = Number(this.maxValue());
  //   if (changes['maxValue']) {
  //     if (currentMaxValue !== null && this.currentValue > currentMaxValue) {
  //       this.currentValue = currentMaxValue;
  //       this.emitValue();
  //     }
  //   }
  // }

  increment(): void {
    const currentMaxValue = Number(this.maxValue());
    if (currentMaxValue === null || this.currentValue < currentMaxValue) {
      this.currentValue++;
      this.emitValue(1);
    }
  }

  decrement(): void {
    if (this.currentValue > 0) {
      this.currentValue--;
      this.emitValue(-1);
    }
  }

  private emitValue(valueChange: number): void {
    this.valueChange.emit(valueChange);
  }

  //meterle id para pasarle el elemento a quitar num
  resetOnCartChange(): void {
    this.cartService.resetNumberInput$.pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        this.decrement();
      },
      error: (error) => {
        console.error('Error accessing cart items:', error);
      }
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
