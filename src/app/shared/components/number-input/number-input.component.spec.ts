import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { NumberInputComponent } from './number-input.component';

describe('NumberInputComponent', () => {
  @Component({
    selector: 'test-host',
    standalone: true,
    imports: [NumberInputComponent],
    template: `
      <app-number-input
        [value]="value"
        [max]="max"
        label="Thursday, 1 October"
        (valueChange)="onValueChange($event)">
      </app-number-input>
    `
  })
  class TestHostComponent {
    value = 1;
    max: number | null = 3;
    emitted: number[] = [];

    onValueChange(value: number) {
      this.emitted.push(value);
    }
  }

  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;

  const buttons = () => fixture.nativeElement.querySelectorAll('.stepper__btn') as NodeListOf<HTMLButtonElement>;
  const decrementButton = () => buttons()[0];
  const incrementButton = () => buttons()[1];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should show the current value', () => {
    expect(fixture.nativeElement.querySelector('output').textContent.trim()).toBe('1');
  });

  it('should emit the next value on increment', () => {
    incrementButton().click();
    expect(host.emitted).toEqual([2]);
  });

  it('should emit the previous value on decrement', () => {
    decrementButton().click();
    expect(host.emitted).toEqual([0]);
  });

  it('should disable decrement at the minimum', () => {
    host.value = 0;
    fixture.detectChanges();

    expect(decrementButton().disabled).toBeTrue();
    decrementButton().click();
    expect(host.emitted).toEqual([]);
  });

  it('should disable increment at the maximum', () => {
    host.value = 3;
    fixture.detectChanges();

    expect(incrementButton().disabled).toBeTrue();
    incrementButton().click();
    expect(host.emitted).toEqual([]);
  });

  it('should allow any value when there is no maximum', () => {
    host.value = 99;
    host.max = null;
    fixture.detectChanges();

    expect(incrementButton().disabled).toBeFalse();
  });

  it('should name the date in the button labels', () => {
    expect(incrementButton().getAttribute('aria-label')).toBe('Add a ticket for Thursday, 1 October');
    expect(decrementButton().getAttribute('aria-label')).toBe('Remove a ticket for Thursday, 1 October');
  });
});
