import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { provideRouter } from '@angular/router';
import { CardComponent } from './card.component';
import { Event } from '../../../core/models/event.model';

@Component({
  standalone: true,
  imports: [CardComponent],
  template: `<app-card [event]="eventData"></app-card>`
})
class TestHostComponent {
  eventData: Event = {
    id: '1',
    title: 'EVENTO DE PRUEBA',
    subtitle: 'Subtítulo de prueba',
    description: 'Descripción del evento',
    place: 'Lugar del evento',
    image: 'image.jpg',
    startDate: '1442959200000',
    endDate: '1447196400000',
  };
}

describe('CardComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    element = fixture.nativeElement;
  });

  it('should render the whole card as a single link to the event page', () => {
    const links = element.querySelectorAll('a');
    expect(links.length).toBe(1);
    expect(links[0].getAttribute('href')).toBe('/event/1');
  });

  it('should show the title in title case', () => {
    expect(element.querySelector('.event-card__title')?.textContent?.trim()).toBe('Evento De Prueba');
  });

  it('should show the venue and subtitle', () => {
    expect(element.querySelector('.event-card__venue')?.textContent).toContain('Lugar del evento');
    expect(element.querySelector('.event-card__subtitle')?.textContent).toContain('Subtítulo de prueba');
  });
});
