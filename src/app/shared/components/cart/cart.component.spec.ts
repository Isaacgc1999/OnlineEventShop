import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CartComponent } from './cart.component';
import { CartService } from '../../../core/services/cart/cart.service';
import { EventCart } from '../../../core/models/cart.model';
import { of, Subject } from 'rxjs';
import { By } from '@angular/platform-browser';
import { CommonModule, DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconButton } from '@angular/material/button';

describe('CartComponent', () => {
  let component: CartComponent;
  let fixture: ComponentFixture<CartComponent>;
  let mockCartService: jasmine.SpyObj<CartService>;
  let destroySpy: jasmine.Spy;

  const mockCartItems: EventCart[] = [
    {
      eventId: '1',
      eventTitle: 'Evento A',
      cart: [
        { session: { date: '2025-04-30', availability: '12' }, ticketQuantity: 2 },
        { session: { date: '2025-04-10', availability: '2' }, ticketQuantity: 1 }
      ]
    }
  ];

  beforeEach(async () => {
    mockCartService = jasmine.createSpyObj('CartService', ['removeItemFromCart', 'getTotalTickets'], {
      cartByEventItems$: of(mockCartItems)
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

  it('should subscribe to cartByEventItems$ and populate cartItemsByEvent', () => {
    expect(component.cartItemsByEvent.length).toBe(1);
    expect(component.cartItemsByEvent[0].eventTitle).toBe('Evento A');
  });

  it('should call removeItemFromCart when removeEvent is called', () => {
    component.removeEvent('1', '2025-04-30');
    expect(mockCartService.removeItemFromCart).toHaveBeenCalledWith('1', '2025-04-30');
  });

  it('should call getTotalTickets when totalTickets() is called', () => {
    mockCartService.getTotalTickets.and.returnValue(3);
    const total = component.totalTickets();
    expect(total).toBe(3);
    expect(mockCartService.getTotalTickets).toHaveBeenCalled();
  });

  it('should clean up subscription on ngOnDestroy', () => {
    // Espiamos los métodos del Subject que está dentro del componente
    const destroy$ = (component as any).destroy$ as Subject<void>;
    const nextSpy = spyOn(destroy$, 'next').and.callThrough();
    const completeSpy = spyOn(destroy$, 'complete').and.callThrough();

    component.ngOnDestroy();

    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});
