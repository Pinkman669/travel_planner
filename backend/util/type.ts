export interface TripItem{
    id: number;
    name: string;
    start_date: Date;
    end_date: Date;
    location: string;
    user_id: number;
    active: boolean;
    DatesOfTrip?: Date[];
}