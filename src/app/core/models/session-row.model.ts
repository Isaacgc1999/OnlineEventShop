import { Session } from "./event-info.model";

export type AvailabilityTone = 'neutral' | 'warning' | 'muted' | 'success';

export interface AvailabilityStatus {
    tone: AvailabilityTone;
    label: string;
}

export interface SessionRow {
    session: Session;
    available: number;
    inCart: number;
    remaining: number;
    status: AvailabilityStatus;
}
