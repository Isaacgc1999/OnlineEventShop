import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventInfoComponent } from './event-info.component';
import { CardInfoComponent } from './card-info/card-info.component';
import { CartComponent } from '../../shared/components/cart/cart.component';
import { ActivatedRoute, convertToParamMap, ParamMap } from '@angular/router';
import { CatalogueService } from '../../core/services/catalogue/catalogue.service';
import { CartService } from '../../core/services/cart/cart.service';
import { BehaviorSubject, of, Subject, throwError } from 'rxjs';
import { EventInfo } from '../../core/models/event-info.model';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('EventInfoComponent', () => {
  let component: EventInfoComponent;
  let fixture: ComponentFixture<EventInfoComponent>;
  let mockActivatedRoute: ActivatedRoute;
  let mockCatalogueService: jasmine.SpyObj<CatalogueService>;
  let mockCartService: jasmine.SpyObj<CartService>;
  let destroy$ = new Subject<void>();
  let paramMapSubject: BehaviorSubject<ParamMap>;
  
  
  const mockEventDetails: EventInfo = {
    event: { id: '68', title: 'Event A', subtitle: 'Event subtitle A', description: '', place: 'test place A', image: '', startDate: '1442959200000', endDate: '1449959200000'},
    sessions: []
  };
  
  
  beforeEach(async () => {
    paramMapSubject = new BehaviorSubject(convertToParamMap({ id: '123' }));
    
    mockActivatedRoute = {
      snapshot: {
        paramMap: convertToParamMap({ id: '123' }),
      },
      paramMap: paramMapSubject.asObservable(),
    } as any;
    
    mockCatalogueService = jasmine.createSpyObj('CatalogueService', ['getEventDetails']);
    mockCatalogueService.getEventDetails.and.returnValue(of(mockEventDetails));
    
    mockCartService = jasmine.createSpyObj('CartService', [
      'setCurrentEventId',
      'setEventInfo',
      'removeItemFromCart',
      'getTotalTickets'
    ]);
    
    (mockCartService as any).cartByEventItems$ = of([]);

    await TestBed.configureTestingModule({
      imports: [EventInfoComponent, CardInfoComponent, CartComponent, HttpClientTestingModule],
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

  afterEach(() => {
    destroy$.next();
    destroy$.complete();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should retrieve eventId from route snapshot on initialization', () => {
    expect(component.eventId).toBe('123');
  });

  it('should call cartService.setCurrentEventId with the eventId from snapshot on initialization', () => {
    expect(mockCartService.setCurrentEventId).toHaveBeenCalledWith('123');
  });

  it('should call getEventInfo with the eventId from snapshot on initialization', () => {
    expect(mockCatalogueService.getEventDetails).toHaveBeenCalledWith('123');
  });

  it('should set eventInfo on successful retrieval of event details', () => {
    expect(component.eventInfo).toEqual(mockEventDetails);
  });

  it('should log an error if getEventDetails fails', () => {
    const error = new Error('Failed to load event details');
    mockCatalogueService.getEventDetails.and.returnValue(throwError(() => error));
    spyOn(console, 'error');
  
    fixture = TestBed.createComponent(EventInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  
    expect(console.error).toHaveBeenCalledWith('Error loading event details:', error);
  
  });

  it('should update eventId and call cartService.setCurrentEventId when route params change', () => {
    const newEventId = '123';
    paramMapSubject.next(convertToParamMap({ id: newEventId }));
    fixture.detectChanges();
  
    expect(component.eventId).toBe(newEventId);
    expect(mockCartService.setCurrentEventId).toHaveBeenCalledWith(newEventId);
    expect(mockCatalogueService.getEventDetails).toHaveBeenCalledWith(newEventId);
  });
});