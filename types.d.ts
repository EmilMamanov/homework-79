export interface Category {
    id: string;
    name: string;
    description?: string;
}

export interface Location {
    id: string;
    name: string;
    description?: string;
}

export interface Item {
    id: string;
    categoryId: string;
    locationId: string;
    name: string;
    description?: string;
    photo?: string;
}