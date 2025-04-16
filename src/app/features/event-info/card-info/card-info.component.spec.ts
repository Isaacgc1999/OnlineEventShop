import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CardInfoComponent } from './card-info.component';
import { provideHttpClient } from '@angular/common/http';

describe('CardInfoComponent', () => {
  let component: CardInfoComponent;
  let fixture: ComponentFixture<CardInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardInfoComponent, HttpClientTestingModule],
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
