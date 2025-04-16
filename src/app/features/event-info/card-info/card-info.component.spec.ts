import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CardInfoComponent } from './card-info.component';
import { CatalogueService } from '../../../core/services/catalogue/catalogue.service';
import { CartService } from '../../../core/services/cart/cart.service';
import { of, throwError } from 'rxjs';
import { EventInfo } from '../../../core/models/event-info.model';
import { Session } from '../../../core/models/event-info.model';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('CardInfoComponent', () => {
  let component: CardInfoComponent;
  let fixture: ComponentFixture<CardInfoComponent>;
  let mockCatalogueService: jasmine.SpyObj<CatalogueService>;
  let mockCartService: jasmine.SpyObj<CartService>;

  const mockSessions: Session[] = [
    { date: '100', availability: '50' },
    { date: '200', availability: '30', }
  ];

  const mockEvent = {
    id: '68',
    title: 'Event A',
    subtitle: 'Event subtitle A',
    description: '',
    place: 'test place A',
    image: '',
    startDate: '1442959200000',
    endDate: '1449959200000'
  }

  const mockEventInfo: EventInfo = {
    event: mockEvent,
    sessions: mockSessions
  };

  beforeEach(() => {
    mockCatalogueService = jasmine.createSpyObj('CatalogueService', ['getEventDetails']);
    mockCartService = jasmine.createSpyObj('CartService', ['setEventInfo', 'addEventToCart']);
    Object.defineProperty(mockCartService, 'cartByEventItems$', { get: () => of([]) });

    TestBed.configureTestingModule({
      imports: [CardInfoComponent, HttpClientTestingModule],
      providers: [
        { provide: CatalogueService, useValue: mockCatalogueService },
        { provide: CartService, useValue: mockCartService }
      ]
    });


    fixture = TestBed.createComponent(CardInfoComponent);
    component = fixture.componentInstance;
    (component as any).eventId = () => '68';
  });

  it('should handle error when loading event details', () => {
    mockCatalogueService.getEventDetails.and.returnValue(throwError(() => new Error('Error')));

    fixture.detectChanges();

    expect(component.eventInfo).toEqual([]);
    expect(component.isLoading).toBeFalse();
  });

  it('should update selected tickets and call addEventToCart', () => {
    component.selectedTickets = { '100': 1 };
    const session = mockSessions[0];

    component.onChangedValue(1, session);

    expect(component.selectedTickets['100']).toBe(2);
    expect(mockCartService.addEventToCart).toHaveBeenCalledWith('100', 2);
  });

  it('should adjust session availability using saved cart data', () => {
    const savedCart = [
      {
        eventId: '68',
        eventTitle: 'Event A',
        cart: [{ session: { date: '100', availability: '50' }, ticketQuantity: 5 }]
      }
    ];
    component.savedCartEventItems = savedCart;
    (component as any).eventId = () => '68';
    component.eventInfo = [...mockSessions];

    component.getRealInfo();

    const updatedSession = component.eventInfo!.find(s => s.date === '100');
    expect(updatedSession?.availability).toBe('45');
  });
});
