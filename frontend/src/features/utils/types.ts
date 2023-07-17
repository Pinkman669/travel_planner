export interface EventItem {
    id: number;
    name: string;
    date: Date;
    time: string;
    location: string;
    business_hours: string[];
    phone: string;
    website: string;
    budget: number;
    expense: number;
    trip_id: number;
    category: string;
    item_order: number;
    day: number;
    active: boolean;
    place_id: string;
}