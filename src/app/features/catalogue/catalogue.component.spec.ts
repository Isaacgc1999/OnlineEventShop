import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { CatalogueComponent } from './catalogue.component';
import { CatalogueService } from '../../core/services/catalogue/catalogue.service';
import { Event } from '../../core/models/event.model';

describe('CatalogueComponent', () => {
  let fixture: ComponentFixture<CatalogueComponent>;
  let catalogueServiceSpy: jasmine.SpyObj<CatalogueService>;

  const mockEvents: Event[] = [
    { id: '184', title: 'Event B', subtitle: 'Event subtitle B', description: '', place: 'test place B', image: '', startDate: '1452959200000', endDate: '1452969200000'},
    { id: '68', title: 'Event A', subtitle: 'Event subtitle A', description: '', place: 'test place A', image: '', startDate: '1442959200000', endDate: '1449959200000'}
  ];

  beforeEach(async () => {
    catalogueServiceSpy = jasmine.createSpyObj('CatalogueService', ['getEvents']);

    await TestBed.configureTestingModule({
      imports: [CatalogueComponent],
      providers: [
        { provide: CatalogueService, useValue: catalogueServiceSpy },
        provideRouter([])
      ]
    }).compileComponents();
  });

  function create(): CatalogueComponent {
    fixture = TestBed.createComponent(CatalogueComponent);
    fixture.detectChanges();
    return fixture.componentInstance;
  }

  it('should create', () => {
    catalogueServiceSpy.getEvents.and.returnValue(of([]));
    expect(create()).toBeTruthy();
  });

  it('should fetch events and sort them by end date', () => {
    catalogueServiceSpy.getEvents.and.returnValue(of(mockEvents));

    const component = create();

    expect(catalogueServiceSpy.getEvents).toHaveBeenCalled();
    expect(component.state().status).toBe('ready');
    expect(component.state().events.map(event => event.id)).toEqual(['68', '184']);
  });

  it('should render one card per event', () => {
    catalogueServiceSpy.getEvents.and.returnValue(of(mockEvents));

    create();

    expect(fixture.nativeElement.querySelectorAll('app-card').length).toBe(2);
    expect(fixture.nativeElement.querySelector('.catalogue__header p').textContent.trim()).toBe('2 events');
  });

  it('should show an error state when events fail to load', () => {
    catalogueServiceSpy.getEvents.and.returnValue(throwError(() => new Error('Network error')));

    const component = create();

    expect(component.state().status).toBe('error');
    expect(fixture.nativeElement.querySelector('.catalogue__state h2').textContent).toContain("Couldn't load events");
  });
});
