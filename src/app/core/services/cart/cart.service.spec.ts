import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CartService } from './cart.service';
import { EventInfo, Session } from '../../models/event-info.model';

describe('CartService', () => {
  let service: CartService;

  const mockSession: Session = {
    date: '2025-04-20',
    availability: '10',
  };

  const mockSecondSession: Session = {
    date: '2025-04-27',
    availability: '5',
  };

  const mockEventInfo: EventInfo = {
    event: { id: '1',
      title: 'Test Event',
      subtitle: 'Test Subtitle',
      description: 'Test Description',
      startDate: '1442959200000',
      endDate: 'endDate',
      place: 'Test Place',
      image: ''},
    sessions: [mockSession, mockSecondSession],
  };
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(CartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set and get currentEventId', (done) => {
    service.setCurrentEventId('123');
    service.currentEventId$.subscribe(id => {
      expect(id).toBe('123');
      done();
    });
  });

  it('should set and get eventInfo', (done) => {
    service.setEventInfo(mockEventInfo);
    service.eventInfo$.subscribe(info => {
      expect(info).toEqual(mockEventInfo);
      done();
    });
  });

  it('should add a session to the cart', (done) => {
    service.setCurrentEventId('1');
    service.setEventInfo(mockEventInfo);

    service.addEventToCart(mockSession.date, 2);

    service.cartByEventItems$.subscribe(cart => {
      expect(cart.length).toBe(1);
      expect(cart[0].eventId).toBe('1');
      expect(cart[0].cart.length).toBe(1);
      expect(cart[0].cart[0].ticketQuantity).toBe(2);
      done();
    });
  });

  it('should update quantity instead of duplicating cart item', (done) => {
    service.setCurrentEventId('1');
    service.setEventInfo(mockEventInfo);

    service.addEventToCart(mockSession.date, 2);
    service.addEventToCart(mockSession.date, 4); // overwrite it to 4 to see if it updates

    service.cartByEventItems$.subscribe(cart => {
      expect(cart[0].cart.length).toBe(1);
      expect(cart[0].cart[0].ticketQuantity).toBe(4);
      done();
    });
  });

  it('should remove every ticket for a session but keep the other sessions', (done) => {
    service.setCurrentEventId('1');
    service.setEventInfo(mockEventInfo);
    service.addEventToCart(mockSession.date, 3);
    service.addEventToCart(mockSecondSession.date, 1);

    service.removeSession('1', mockSession.date);

    service.cartByEventItems$.subscribe(cart => {
      expect(cart.length).toBe(1);
      expect(cart[0].cart.length).toBe(1);
      expect(cart[0].cart[0].session.date).toBe(mockSecondSession.date);
      done();
    });
  });

  it('should drop the event once its last session is removed', (done) => {
    service.setCurrentEventId('1');
    service.setEventInfo(mockEventInfo);
    service.addEventToCart(mockSession.date, 2);

    service.removeSession('1', mockSession.date);

    service.cartByEventItems$.subscribe(cart => {
      expect(cart.length).toBe(0);
      expect(JSON.parse(localStorage.getItem('cartByEventItems') ?? 'null')).toEqual([]);
      done();
    });
  });

  it('should return total number of tickets in cart', () => {
    service.setCurrentEventId('1');
    service.setEventInfo(mockEventInfo);
    service.addEventToCart(mockSession.date, 3);

    expect(service.getTotalTickets()).toBe(3);
  });

  it('should clear the cart without changing session availability', () => {
    service.setCurrentEventId('1');
    service.setEventInfo(mockEventInfo);
    service.addEventToCart(mockSession.date, 2);

    service.clearCart();

    expect(service.getTotalTickets()).toBe(0);
    expect(mockSession.availability).toBe('10');
    expect(localStorage.getItem('cartByEventItems')).toBeNull();
  });

  it('should restore a cart saved before clearing', () => {
    service.setCurrentEventId('1');
    service.setEventInfo(mockEventInfo);
    service.addEventToCart(mockSession.date, 2);
    let snapshot: any[] = [];
    service.cartByEventItems$.subscribe(cart => snapshot = cart).unsubscribe();

    service.clearCart();
    service.restoreCart(snapshot);

    expect(service.getTotalTickets()).toBe(2);
    expect(localStorage.getItem('cartByEventItems')).not.toBeNull();
  });
});
