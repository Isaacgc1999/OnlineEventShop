import { Component } from '@angular/core';
import { CardComponent } from "../../shared/components/card/card.component";

@Component({
  selector: 'app-catalogue',
  standalone: true,
  imports: [CardComponent],
  templateUrl: './catalogue.component.html',
  styleUrl: './catalogue.component.scss'
})
export class CatalogueComponent {

}
