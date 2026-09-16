import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { availabilityStatus, CardInfoComponent } from './card-info.component';
import { CatalogueService } from '../../../core/services/catalogue/catalogue.service';
import { CartService } from '../../../core/services/cart/cart.service';
import { EventInfo, Session } from '../../../core/models/event-info.model';
import { EventCart } from '../../../core/models/cart.model';

describe('CardInfoComponent', () => {
  let component: CardInfoComponent;
  let fixture: ComponentFixture<CardInfoComponent>;
  let mockCatalogueService: jasmine.SpyObj<CatalogueService>;
  let mockCartService: jasmine.SpyObj<CartService>;
  let cart$: BehaviorSubject<EventCart[]>;

  const mockSessions: Session[] = [
    { date: '200', availability: '30' },
    { date: '100', availability: '50' }
  ];

  const mockEventInfo: EventInfo = {
    event: {
      id: '68',
      title: 'Event A',
      subtitle: 'Event subtitle A',
      description: '',
      place: 'test place A',
      image: '',
      startDate: '1442959200000',
      endDate: '1449959200000'
    },
    sessions: mockSessions
  };

  beforeEach(() => {
    cart$ = new BehaviorSubject<EventCart[]>([]);
    mockCatalogueService = jasmine.createSpyObj('CatalogueService', ['getEventDetails']);
    mockCatalogueService.getEventDetails.and.returnValue(of(mockEventInfo));
    mockCartService = jasmine.createSpyObj('CartService', ['setEventInfo', 'addEventToCart'], {
      cartByEventItems$: cart$.asObservable()
    });

    TestBed.configureTestingModule({
      imports: [CardInfoComponent],
      providers: [
        { provide: CatalogueService, useValue: mockCatalogueService },
        { provide: CartService, useValue: mockCartService }
      ]
    });

    fixture = TestBed.createComponent(CardInfoComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('eventId', '68');
  });

  it('should load the sessions sorted by date and share the event info', () => {
    fixture.detectChanges();

    expect(mockCatalogueService.getEventDetails).toHaveBeenCalledWith('68');
    expect(component.rows().map(row => row.session.date)).toEqual(['100', '200']);
    expect(mockCartService.setEventInfo).toHaveBeenCalledWith(mockEventInfo);
  });

  it('should handle error when loading event details', () => {
    mockCatalogueService.getEventDetails.and.returnValue(throwError(() => new Error('Error')));

    fixture.detectChanges();

    expect(component.sessions()).toEqual([]);
    expect(component.loadFailed()).toBeTrue();
    expect(fixture.nativeElement.querySelector('.sessions__empty')).not.toBeNull();
  });

  it('should take tickets already in the cart into account', () => {
    cart$.next([{
      eventId: '68',
      eventTitle: 'Event A',
      cart: [{ session: { date: '100', availability: '50' }, ticketQuantity: 5 }]
    }]);
    fixture.detectChanges();

    const row = component.rows().find(r => r.session.date === '100');
    expect(row?.inCart).toBe(5);
    expect(row?.available).toBe(50);
    expect(row?.remaining).toBe(45);
  });

  it('should ignore tickets for other events', () => {
    cart$.next([{
      eventId: '184',
      eventTitle: 'Event B',
      cart: [{ session: { date: '100', availability: '50' }, ticketQuantity: 5 }]
    }]);
    fixture.detectChanges();

    expect(component.rows().find(r => r.session.date === '100')?.inCart).toBe(0);
  });

  it('should set the new quantity in the cart', () => {
    component.onQuantityChange(mockSessions[1], 2);

    expect(mockCartService.addEventToCart).toHaveBeenCalledWith('100', 2);
  });

  it('should describe availability by scarcity', () => {
    expect(availabilityStatus(8, 0)).toEqual({ tone: 'neutral', label: '8 available' });
    expect(availabilityStatus(2, 0)).toEqual({ tone: 'warning', label: 'Only 2 left' });
    expect(availabilityStatus(1, 0)).toEqual({ tone: 'warning', label: 'Last ticket' });
    expect(availabilityStatus(0, 0)).toEqual({ tone: 'muted', label: 'Sold out' });
    expect(availabilityStatus(0, 4)).toEqual({ tone: 'success', label: 'All in your cart' });
  });
});
