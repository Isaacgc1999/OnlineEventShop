import { Component, inject, OnInit } from '@angular/core';
import { CardComponent } from "../../shared/components/card/card.component";
import { CatalogueService } from '../../core/services/catalogue.service';
import { Event } from '../../core/models/event.model';

@Component({
  selector: 'app-catalogue',
  standalone: true,
  imports: [CardComponent],
  templateUrl: './catalogue.component.html',
  styleUrl: './catalogue.component.scss'
})
export class CatalogueComponent  implements OnInit{
  catalogueService = inject(CatalogueService);
  events: Event[] = [];

  ngOnInit(){
    this.catalogueService.getEvents().subscribe((events) => {
      this.events = events;
    });
  }
}
