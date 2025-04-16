import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { ButtonComponent } from './button.component';
import { By } from '@angular/platform-browser';

@Component({
  selector: 'app-test-host',
  template: `<app-button [text]="text" [isDisabled]="isDisabled" (onClick)="handleClick()"></app-button>`,
  standalone: true,
  imports: [ButtonComponent],
})
class TestHostComponent {
  text = 'Click me';
  isDisabled = false;
  handleClick = jasmine.createSpy('handleClick');
}

describe('ButtonComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let hostComponent: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    hostComponent = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should render the text inside the button', () => {
    const button = fixture.debugElement.query(By.css('button')).nativeElement;
    expect(button.textContent.trim()).toBe('Click me');
  });

  it('should call handleClick when clicked', () => {
    const button = fixture.debugElement.query(By.css('button')).nativeElement;
    button.click();
    expect(hostComponent.handleClick).toHaveBeenCalled();
  });

  it('should disable the button if isDisabled is true', () => {
    hostComponent.isDisabled = true;
    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css('button')).nativeElement;
    expect(button.disabled).toBeTrue();
  });
});
