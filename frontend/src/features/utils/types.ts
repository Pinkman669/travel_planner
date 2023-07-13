export interface EventItem {
    id: number;
    name: string;
    date: Date | string;
    time: Date;
    location: string;
    business_hours: string;
    phone: string;
    website: string;
    budget: number;
    expense: number;
    trip_id: number;
    category: string;
    item_order: number;
    day: number;
}