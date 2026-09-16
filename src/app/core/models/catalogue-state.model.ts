import { Event } from "./event.model";

export interface CatalogueState {
    status: 'loading' | 'ready' | 'error';
    events: Event[];
}
