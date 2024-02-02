import { promises as fs } from 'fs';
import path from 'path';
import { Category, Location, Item } from './types';
import crypto from 'crypto';

const categoriesFilePath: string = './data/categories.json';
const locationsFilePath: string = './data/locations.json';
const itemsFilePath: string = './data/items.json';

async function initializeFile(filePath: string, defaultValue: string) {
    try {
        await fs.access(filePath);
    } catch (error) {
        await fs.writeFile(filePath, defaultValue, 'utf-8');
    }
}

async function initializeDataFiles() {
    await initializeFile(categoriesFilePath, '[]');
    await initializeFile(locationsFilePath, '[]');
    await initializeFile(itemsFilePath, '[]');
}

initializeDataFiles();

const fileDb = {
    async init() {
        await initializeDataFiles();
    },

    async saveCategory(category: Category): Promise<Category> {
        const { id, name, description } = category;
        const categoryId = id || crypto.randomUUID();
        const categoriesContent = await fs.readFile(categoriesFilePath, 'utf-8');

        try {
            const categories = JSON.parse(categoriesContent) as Category[];

            const newCategory: Category = { id: categoryId, name, description };
            categories.push(newCategory);

            await fs.writeFile(categoriesFilePath, JSON.stringify(categories), 'utf-8');
            return newCategory;
        } catch (error) {
            console.error('Error parsing JSON:', error);
            throw error;
        }
    },

    async getCategories(): Promise<Category[]> {
        const categoriesContent = await fs.readFile(categoriesFilePath, 'utf-8');
        const categories = JSON.parse(categoriesContent) as Category[];
        return categories;
    },

    async saveItem(item: Item): Promise<Item> {
        const { id, categoryId, locationId, name, description, image } = item;
        const itemId = id || crypto.randomUUID();
        const itemsContent = await fs.readFile(itemsFilePath, 'utf-8');
        const items = JSON.parse(itemsContent) as Item[];

        const newItem: Item = { id: itemId, categoryId, locationId, name, description, image };
        items.push(newItem);

        await fs.writeFile(itemsFilePath, JSON.stringify(items), 'utf-8');
        return newItem;
    },

    async getItems(): Promise<Item[]> {
        const itemsContent = await fs.readFile(itemsFilePath, 'utf-8');
        const items = JSON.parse(itemsContent) as Item[];
        return items;
    },

    async getItemById(itemId: string): Promise<Item | undefined> {
        const itemsContent = await fs.readFile(itemsFilePath, 'utf-8');
        const items = JSON.parse(itemsContent) as Item[];
        return items.find((item) => item.id === itemId);
    },

    async deleteItem(itemId: string): Promise<void> {
        const itemsContent = await fs.readFile(itemsFilePath, 'utf-8');
        let items = JSON.parse(itemsContent) as Item[];

        items = items.filter((item) => item.id !== itemId);

        await fs.writeFile(itemsFilePath, JSON.stringify(items), 'utf-8');
    },

    async updateItem(itemId: string, updatedData: Partial<Item>): Promise<Item | undefined> {
        const itemsContent = await fs.readFile(itemsFilePath, 'utf-8');
        let items = JSON.parse(itemsContent) as Item[];

        const existingItemIndex = items.findIndex((item) => item.id === itemId);

        if (existingItemIndex !== -1) {
            const updatedItem = { ...items[existingItemIndex], ...updatedData };
            items[existingItemIndex] = updatedItem;

            await fs.writeFile(itemsFilePath, JSON.stringify(items), 'utf-8');
            return updatedItem;
        }

        return undefined;
    },

    async saveLocation(location: Location): Promise<Location> {
        const { id, name, description } = location;
        const locationId = id || crypto.randomUUID();
        const locationsContent = await fs.readFile(locationsFilePath, 'utf-8');
        const locations = JSON.parse(locationsContent) as Location[];

        const newLocation: Location = { id: locationId, name, description };
        locations.push(newLocation);

        await fs.writeFile(locationsFilePath, JSON.stringify(locations), 'utf-8');
        return newLocation;
    },

    async getLocations(): Promise<Location[]> {
        const locationsContent = await fs.readFile(locationsFilePath, 'utf-8');
        const locations = JSON.parse(locationsContent) as Location[];
        return locations;
    },

    async getLocationById(locationId: string): Promise<Location | undefined> {
        const locationsContent = await fs.readFile(locationsFilePath, 'utf-8');
        const locations = JSON.parse(locationsContent) as Location[];
        return locations.find((location) => location.id === locationId);
    },

    async deleteLocation(locationId: string): Promise<void> {
        const locationsContent = await fs.readFile(locationsFilePath, 'utf-8');
        let locations = JSON.parse(locationsContent) as Location[];

        locations = locations.filter((location) => location.id !== locationId);

        await fs.writeFile(locationsFilePath, JSON.stringify(locations), 'utf-8');
    },

    async updateLocation(locationId: string, updatedData: Partial<Location>): Promise<Location | undefined> {
        const locationsContent = await fs.readFile(locationsFilePath, 'utf-8');
        let locations = JSON.parse(locationsContent) as Location[];

        const existingLocationIndex = locations.findIndex((location) => location.id === locationId);

        if (existingLocationIndex !== -1) {
            const updatedLocation = { ...locations[existingLocationIndex], ...updatedData };
            locations[existingLocationIndex] = updatedLocation;

            await fs.writeFile(locationsFilePath, JSON.stringify(locations), 'utf-8');
            return updatedLocation;
        }

        return undefined;
    },

};

export default fileDb;
