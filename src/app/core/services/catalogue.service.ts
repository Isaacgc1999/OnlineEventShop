import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Event } from '../models/event.model';
import { delay, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CatalogueService {
  private mockApiUrl = '/mocks/events.json';

  constructor(private httpClient: HttpClient) {}

  getEvents(): Observable<Event[]>{
    return this.httpClient.get<Event[]>(this.mockApiUrl).pipe(delay(500));
  }
}
