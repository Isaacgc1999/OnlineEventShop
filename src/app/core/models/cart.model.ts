import { Session } from "./event-info.model";

export interface CartItem {
    session: Session;
    ticketQuantity: number;
}

export interface EventCart {
    [eventId: string]: CartItem[];
}