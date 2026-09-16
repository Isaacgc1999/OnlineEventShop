import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventInfoComponent } from './event-info.component';
import { ActivatedRoute, convertToParamMap, ParamMap } from '@angular/router';
import { CatalogueService } from '../../core/services/catalogue/catalogue.service';
import { CartService } from '../../core/services/cart/cart.service';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { EventInfo } from '../../core/models/event-info.model';
import { Event } from '../../core/models/event.model';

describe('EventInfoComponent', () => {
  let component: EventInfoComponent;
  let fixture: ComponentFixture<EventInfoComponent>;
  let mockActivatedRoute: ActivatedRoute;
  let mockCatalogueService: jasmine.SpyObj<CatalogueService>;
  let mockCartService: jasmine.SpyObj<CartService>;
  let paramMapSubject: BehaviorSubject<ParamMap>;

  const mockEvent: Event = {
    id: '123', title: 'EVENT A', subtitle: 'Event subtitle A', description: 'About event A',
    place: 'test place A', image: '', startDate: '1442959200000', endDate: '1449959200000'
  };

  const mockEventDetails: EventInfo = { event: mockEvent, sessions: [] };

  beforeEach(async () => {
    paramMapSubject = new BehaviorSubject(convertToParamMap({ id: '123' }));

    mockActivatedRoute = {
      snapshot: {
        paramMap: convertToParamMap({ id: '123' }),
      },
      paramMap: paramMapSubject.asObservable(),
    } as any;

    mockCatalogueService = jasmine.createSpyObj('CatalogueService', ['getEventById', 'getEventDetails']);
    mockCatalogueService.getEventById.and.returnValue(of([mockEvent]));
    mockCatalogueService.getEventDetails.and.returnValue(of(mockEventDetails));

    mockCartService = jasmine.createSpyObj('CartService', [
      'setCurrentEventId',
      'setEventInfo',
      'addEventToCart',
      'removeSession',
      'clearCart',
      'restoreCart'
    ], {
      cartByEventItems$: of([])
    });

    await TestBed.configureTestingModule({
      imports: [EventInfoComponent],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: CatalogueService, useValue: mockCatalogueService },
        { provide: CartService, useValue: mockCartService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EventInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should retrieve eventId from route snapshot on initialization', () => {
    expect(component.eventId).toBe('123');
  });

  it('should call cartService.setCurrentEventId with the eventId on initialization', () => {
    expect(mockCartService.setCurrentEventId).toHaveBeenCalledWith('123');
  });

  it('should load the event and show its title in title case', () => {
    expect(mockCatalogueService.getEventById).toHaveBeenCalledWith('123');
    expect(component.event()).toEqual(mockEvent);
    expect(fixture.nativeElement.querySelector('h1').textContent.trim()).toBe('Event A');
  });

  it('should log an error if the event fails to load', () => {
    const error = new Error('Failed to load event');
    mockCatalogueService.getEventById.and.returnValue(throwError(() => error));
    spyOn(console, 'error');

    fixture = TestBed.createComponent(EventInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(console.error).toHaveBeenCalledWith('Error loading event:', error);
    expect(component.event()).toBeNull();
  });

  it('should update eventId and reload when route params change', () => {
    paramMapSubject.next(convertToParamMap({ id: '456' }));
    fixture.detectChanges();

    expect(component.eventId).toBe('456');
    expect(mockCartService.setCurrentEventId).toHaveBeenCalledWith('456');
    expect(mockCatalogueService.getEventById).toHaveBeenCalledWith('456');
  });
});
