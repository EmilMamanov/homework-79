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


};

export default fileDb;
