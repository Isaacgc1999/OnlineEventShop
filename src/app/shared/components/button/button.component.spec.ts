import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { ButtonComponent } from './button.component';
import { ButtonVariant } from '../../models/button.model';

@Component({
  selector: 'app-test-host',
  template: `
    <app-button
      [variant]="variant"
      [disabled]="isDisabled"
      [loading]="isLoading"
      (click)="handleClick()">Click me</app-button>
  `,
  standalone: true,
  imports: [ButtonComponent],
})
class TestHostComponent {
  variant: ButtonVariant = 'primary';
  isDisabled = false;
  isLoading = false;
  handleClick = jasmine.createSpy('handleClick');
}

describe('ButtonComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;
  let button: HTMLButtonElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
    button = fixture.nativeElement.querySelector('button');
  });

  it('should render the projected content', () => {
    expect(button.textContent?.trim()).toBe('Click me');
  });

  it('should default to type="button"', () => {
    expect(button.type).toBe('button');
  });

  it('should call the click handler', () => {
    button.click();
    expect(host.handleClick).toHaveBeenCalled();
  });

  it('should not call the click handler while disabled', () => {
    host.isDisabled = true;
    fixture.detectChanges();

    button.click();
    expect(button.disabled).toBeTrue();
    expect(host.handleClick).not.toHaveBeenCalled();
  });

  it('should disable the button and show a spinner while loading', () => {
    host.isLoading = true;
    fixture.detectChanges();

    expect(button.disabled).toBeTrue();
    expect(button.getAttribute('aria-busy')).toBe('true');
    expect(button.querySelector('.spinner')).not.toBeNull();
  });

  it('should apply the variant class', () => {
    host.variant = 'plain';
    fixture.detectChanges();

    expect(button.classList).toContain('btn--plain');
    expect(button.classList).not.toContain('btn--primary');
  });
});
