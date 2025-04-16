import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CatalogueService } from './catalogue.service';
import { Event } from '../../models/event.model';
import { EventInfo } from '../../models/event-info.model';

describe('CatalogueService', () => {
  let service: CatalogueService;
  let httpMock: HttpTestingController;

  const mockEvents: Event[] = [
    { id: '68', title: 'Event A', subtitle: 'Event subtitle A', description: '', place: 'test place A', image: '', startDate: '1442959200000', endDate: '1449959200000'},
    { id: '184', title: 'Event B', subtitle: 'Event subtitle B', description: '',place: 'test place B', image: '', startDate: '1452959200000', endDate: '1452969200000'}
  ];

  const mockEventInfo68: EventInfo = {
    event: mockEvents[0],
    sessions: [{ date: '2025-04-30', availability: '100' }]
  };

  const mockEventInfo184: EventInfo = {
    event: mockEvents[1],
    sessions: [{ date: '2025-05-10', availability: '50' }]
  };


  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CatalogueService]
    });
    service = TestBed.inject(CatalogueService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch all events', (done) => {
    service.getEvents().subscribe(events => {
      expect(events.length).toBe(2);
      expect(events).toEqual(mockEvents);
      done();
    });

    const req = httpMock.expectOne('/mocks/events.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockEvents);
  });

  it('should fetch an event by ID', (done) => {
    service.getEventById('68').subscribe(events => {
      expect(events.length).toBe(1);
      expect(events[0].id).toBe('68');
      done();
    });

    const req = httpMock.expectOne('/mocks/events.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockEvents);
  });

  it('should fetch event details for event 68', (done) => {
    service.getEventDetails('68').subscribe(details => {
      expect(details).toEqual(mockEventInfo68);
      done();
    });

    const req = httpMock.expectOne('/mocks/event-info-68.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockEventInfo68);
  });

  it('should fetch event details for event 184', (done) => {
    service.getEventDetails('184').subscribe(details => {
      expect(details).toEqual(mockEventInfo184);
      done();
    });

    const req = httpMock.expectOne('/mocks/event-info-184.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockEventInfo184);
  });
});
