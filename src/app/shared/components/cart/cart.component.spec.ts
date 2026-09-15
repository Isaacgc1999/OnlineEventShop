import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { CartComponent } from './cart.component';
import { CartService } from '../../../core/services/cart/cart.service';
import { EventCart } from '../../../core/models/cart.model';

describe('CartComponent', () => {
  let component: CartComponent;
  let fixture: ComponentFixture<CartComponent>;
  let mockCartService: jasmine.SpyObj<CartService>;
  let cart$: BehaviorSubject<EventCart[]>;

  const mockCartItems: EventCart[] = [
    {
      eventId: '1',
      eventTitle: 'EVENTO A',
      cart: [
        { session: { date: '2025-04-30', availability: '12' }, ticketQuantity: 2 },
        { session: { date: '2025-04-10', availability: '2' }, ticketQuantity: 1 }
      ]
    }
  ];

  const element = (): HTMLElement => fixture.nativeElement;

  beforeEach(async () => {
    cart$ = new BehaviorSubject<EventCart[]>(mockCartItems);
    mockCartService = jasmine.createSpyObj('CartService', ['removeSession', 'clearCart', 'restoreCart'], {
      cartByEventItems$: cart$.asObservable()
    });

    await TestBed.configureTestingModule({
      imports: [CartComponent],
      providers: [{ provide: CartService, useValue: mockCartService }],
    }).compileComponents();

    fixture = TestBed.createComponent(CartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should show the total ticket count as the headline number', () => {
    expect(component.totalTickets()).toBe(3);
    expect(element().querySelector('.summary__number')?.textContent?.trim()).toBe('3');
  });

  it('should list the event in title case with one line per session', () => {
    expect(element().querySelector('.summary__event h3')?.textContent?.trim()).toBe('Evento A');
    expect(element().querySelectorAll('.summary__line').length).toBe(2);
  });

  it('should remove a whole session when its remove button is clicked', () => {
    (element().querySelector('.summary__remove') as HTMLButtonElement).click();
    expect(mockCartService.removeSession).toHaveBeenCalledWith('1', '2025-04-30');
  });

  it('should show the empty state when the cart is empty', () => {
    cart$.next([]);
    fixture.detectChanges();

    expect(element().querySelector('.summary__empty')).not.toBeNull();
    expect(element().querySelector('.cart-bar')).toBeNull();
  });

  it('should clear the cart and offer an undo that restores it', () => {
    component.clearCart();
    fixture.detectChanges();

    expect(mockCartService.clearCart).toHaveBeenCalled();
    expect(element().querySelector('.toast')).not.toBeNull();

    (element().querySelector('.toast button') as HTMLButtonElement).click();
    fixture.detectChanges();

    expect(mockCartService.restoreCart).toHaveBeenCalledWith(mockCartItems);
    expect(element().querySelector('.toast')).toBeNull();
  });
});
