import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Event } from '../models/event.model';
import { delay, map, Observable, of } from 'rxjs';
import { EventInfo } from '../models/event-info.model';

@Injectable({
  providedIn: 'root'
})
export class CatalogueService {
  private mockApiUrl = '/mocks/events.json';
  private mockApiDetail68Url = '/mocks/event-info-68.json';
  private mockApiDetail184Url = '/mocks/event-info-184.json';

  constructor(private httpClient: HttpClient) {}

  getEvents(): Observable<Event[]>{
    return this.httpClient.get<Event[]>(this.mockApiUrl).pipe(delay(500));
  }

  getEventById(eventId: string): Observable<Event[]>{
    return this.httpClient.get<Event[]>(this.mockApiUrl).pipe(
      delay(500),
      map((events: Event[]) => events.filter(event => event.id === eventId))
    );
  }

  getEventDetails(eventId: string): Observable<EventInfo> {
    var url = '';
    if(eventId === "68"){
      url = this.mockApiDetail68Url;
    }
    else if(eventId === "184"){
      url = this.mockApiDetail184Url;
    }
    return this.httpClient.get<EventInfo>(url).pipe(delay(500));
  }
}
