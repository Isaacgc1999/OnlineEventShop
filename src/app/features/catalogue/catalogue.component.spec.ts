import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CatalogueComponent } from './catalogue.component';
import { CatalogueService } from '../../core/services/catalogue/catalogue.service';
import { Event } from '../../core/models/event.model';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';

// Dummy CardComponent to avoid errors in the tests
@Component({ selector: 'app-card', template: '' })
class MockCardComponent {}

describe('CatalogueComponent', () => {
  let component: CatalogueComponent;
  let fixture: ComponentFixture<CatalogueComponent>;
  let catalogueServiceSpy: jasmine.SpyObj<CatalogueService>;
  let routerSpy: jasmine.SpyObj<Router>;

  const mockEvents: Event[] = [
    { id: '68', title: 'Event A', subtitle: 'Event subtitle A', description: '', place: 'test place A', image: '', startDate: '1442959200000', endDate: '1449959200000'},
    { id: '184', title: 'Event B', subtitle: 'Event subtitle B', description: '',place: 'test place B', image: '', startDate: '1452959200000', endDate: '1452969200000'}
  ];

  beforeEach(async () => {
    const catalogueSpy = jasmine.createSpyObj('CatalogueService', ['getEvents']);
    const routerMock = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [CatalogueComponent, HttpClientTestingModule, MockCardComponent],
      providers: [
        { provide: CatalogueService, useValue: catalogueSpy },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CatalogueComponent);
    component = fixture.componentInstance;
    catalogueServiceSpy = TestBed.inject(CatalogueService) as jasmine.SpyObj<CatalogueService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch and sort events on init', () => {
    catalogueServiceSpy.getEvents.and.returnValue(of(mockEvents));

    component.ngOnInit();

    expect(catalogueServiceSpy.getEvents).toHaveBeenCalled();
    expect(component.events.length).toBe(2);
    expect(component.events[0].id).toBe('68');
    expect(component.events[1].id).toBe('184');
  });

  it('should navigate to event detail on card click', () => {
    const eventId = '123';
    component.onCardClick(eventId);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/event', eventId]);
  });

  it('should clean up subscriptions on destroy', () => {
    spyOn(component['destroy$'], 'next');
    spyOn(component['destroy$'], 'complete');

    component.ngOnDestroy();

    expect(component['destroy$'].next).toHaveBeenCalled();
    expect(component['destroy$'].complete).toHaveBeenCalled();
  });
});
