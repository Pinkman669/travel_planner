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

export interface UpdateEventInfo{
    time: string;
    budget: number;
    category: string;
    expense: number;
    website: string;
    phone: string;
    name: string;
}