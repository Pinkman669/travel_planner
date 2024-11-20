export interface TripItem {
    id: number;
    name: string;
    start_date: Date;
    end_date: Date;
    location: string;
    user_id: number;
    active: boolean;
    DatesOfTrip?: string[];
}

export interface UpdateEventInfo {
    time: string;
    budget: number;
    category: string;
    expense: number;
    website: string;
    phone: string;
    name: string;
}

export interface LocationDetail {
    name?: string,
    formatted_address?: string,
    formatted_phone_number?: string,
    opening_hours?: string[],
    website?: string,
    place_id?: string
}

export interface LocationInfo {
    name: string;
    address: string;
    businessHours: string[] | null;
    phone: string | null;
    website: string | null;
}

export interface User {
    id: number;
    name: string;
    email: string;
    password: string;
    birthday: Date;
}

export interface BudgetAndExpenseItem {
    name: string;
    category: string;
    budget: number;
    expense: number;
}

export interface favouriteEvents {
    name: string;
    address: string;
    business_hours: string;
    phone: string;
    website: string;
    trip_id: number;
    user_id: number;
    active: boolean;
    place_id: string;
}