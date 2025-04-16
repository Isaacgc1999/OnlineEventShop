import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { CardComponent } from './card.component';
import { By } from '@angular/platform-browser';
import { Event } from '../../../core/models/event.model';

@Component({
  standalone: true,
  imports: [CardComponent],
  template: `
    <app-card [event]="eventData" (click)="handleClick()"></app-card>
  `
})
class TestHostComponent {
  eventData: Event = {
    id: '1',
    title: 'Evento de prueba',
    subtitle: 'Subtítulo de prueba',
    description: 'Descripción del evento',
    place: 'Lugar del evento',
    image: 'image.jpg',
    startDate: '2025-05-01',
    endDate: '2025-05-03',
  };

  handleClick = jasmine.createSpy('handleClick');
}

describe('CardComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let hostComponent: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    hostComponent = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should emit click when button is clicked', () => {
    const button = fixture.debugElement.query(By.css('button')).nativeElement;
    button.click();
    expect(hostComponent.handleClick).toHaveBeenCalled();
  });
});
