import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NumberInputComponent } from './number-input.component';
import { Component } from '@angular/core';
import { CartService } from '../../../core/services/cart/cart.service';
import { BehaviorSubject } from 'rxjs';
import { By } from '@angular/platform-browser';

describe('NumberInputComponent with host', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let hostComponent: TestHostComponent;
  let cartServiceMock: jasmine.SpyObj<CartService>;
  let resetSubject: BehaviorSubject<string>;

  @Component({
    selector: 'test-host',
    standalone: true,
    imports: [NumberInputComponent],
    template: `
      <app-number-input
        [maxValue]="maxValue"
        [elementToReset]="elementToReset"
        (valueChange)="onValueChange($event)">
      </app-number-input>
    `
  })
  class TestHostComponent {
    maxValue: string | null = '5';
    elementToReset: string = 'session-1';
    valueChanges: number[] = [];

    onValueChange(change: number) {
      this.valueChanges.push(change);
    }
  }

  beforeEach(async () => {
    resetSubject = new BehaviorSubject<string>('');
    cartServiceMock = jasmine.createSpyObj<CartService>('CartService', [], {
      resetNumberInputSession$: resetSubject.asObservable()
    });

    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [{ provide: CartService, useValue: cartServiceMock }]
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    hostComponent = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should increment and emit valueChange', () => {
    const numberInput = fixture.debugElement.query(By.directive(NumberInputComponent)).componentInstance;
    numberInput.increment();
    fixture.detectChanges();

    expect(numberInput.currentValue).toBe(1);
    expect(hostComponent.valueChanges).toEqual([1]);
  });

  it('should decrement and emit valueChange', () => {
    const numberInput = fixture.debugElement.query(By.directive(NumberInputComponent)).componentInstance;
    numberInput.currentValue = 2;
    numberInput.decrement();
    fixture.detectChanges();

    expect(numberInput.currentValue).toBe(1);
    expect(hostComponent.valueChanges).toEqual([-1]);
  });

  it('should not decrement below 0', () => {
    const numberInput = fixture.debugElement.query(By.directive(NumberInputComponent)).componentInstance;
    numberInput.currentValue = 0;
    numberInput.decrement();
    fixture.detectChanges();

    expect(numberInput.currentValue).toBe(0);
    expect(hostComponent.valueChanges).toEqual([]);
  });

  it('should not increment beyond maxValue', () => {
    const numberInput = fixture.debugElement.query(By.directive(NumberInputComponent)).componentInstance;

    hostComponent.maxValue = '2';
    fixture.detectChanges();

    numberInput.increment(); // 1
    numberInput.increment(); // 2
    numberInput.increment(); // should not work
    fixture.detectChanges();

    expect(numberInput.currentValue).toBe(2);
    expect(hostComponent.valueChanges).toEqual([1, 1]);
  });

  it('should emit reset on matching elementToReset', () => {
    const numberInput = fixture.debugElement.query(By.directive(NumberInputComponent)).componentInstance;
    numberInput.currentValue = 3;
    fixture.detectChanges();

    resetSubject.next('session-1'); 

    fixture.detectChanges();

    expect(numberInput.currentValue).toBe(2);
    expect(hostComponent.valueChanges).toEqual([-1]);
  });

  it('should NOT emit reset on non-matching elementToReset', () => {
    const numberInput = fixture.debugElement.query(By.directive(NumberInputComponent)).componentInstance;
    numberInput.currentValue = 3;
    fixture.detectChanges();

    resetSubject.next('different-session'); 
    fixture.detectChanges();

    expect(numberInput.currentValue).toBe(3);
    expect(hostComponent.valueChanges).toEqual([]);
  });
});
