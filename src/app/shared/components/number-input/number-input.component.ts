import { ChangeDetectionStrategy, Component, inject, input, OnChanges, OnDestroy, OnInit, output, SimpleChanges } from '@angular/core';
import { CartService } from '../../../core/services/cart/cart.service';
import { EventCart } from '../../../core/models/cart.model';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-number-input',
  standalone: true,
  imports: [],
  templateUrl: './number-input.component.html',
  styleUrl: './number-input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NumberInputComponent implements OnInit, OnDestroy{
  private cartService = inject(CartService);
  readonly maxValue = input<string|null>(null);
  readonly elementToReset = input<string>('');
  readonly valueChange = output<number>();

  private readonly destroy$ = new Subject<void>();
  

  currentValue: number = 0;

  ngOnInit(): void {
    this.subscribeToCartChanges();
  }

  reset(): void {
    this.emitValue(-this.currentValue);
    this.currentValue = 0;
  }

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

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['cartService'] && changes['cartService'].currentValue === null) {
      this.subscribeToCartChanges();
    }
  }

  subscribeToCartChanges(): void {
    this.cartService.resetNumberInputSession$.pipe(takeUntil(this.destroy$)).subscribe(el => {
      if (el === this.elementToReset()) {
        this.decrement();
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
