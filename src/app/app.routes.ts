import { Routes } from '@angular/router';
import { CatalogueComponent } from './features/catalogue/catalogue.component';
import { EventInfoComponent } from './features/event-info/event-info.component';

export const routes: Routes = [
    {
        path: '',
        component: CatalogueComponent,
        children: [
        { path: '', component: CatalogueComponent },
        { path: 'event/:id', component: EventInfoComponent }
        ]
    },
    { path: '**', redirectTo: '' }
];
