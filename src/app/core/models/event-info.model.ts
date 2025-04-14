import { Event } from "./event.model";

export interface Session {
    date: string;
    availability: string;
}

export interface EventInfo {
    event: Event;
    sessions: Session[];
}