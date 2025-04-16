import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { EventInfoComponent } from './event-info.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('EventInfoComponent', () => {
  let component: EventInfoComponent;
  let fixture: ComponentFixture<EventInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventInfoComponent, HttpClientTestingModule, RouterTestingModule ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
