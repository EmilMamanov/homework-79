import express, { Router } from 'express';
import { Category } from '../types';
import fileDb from '../fileDb';
import crypto from 'crypto';

const router: Router = express.Router();

router.post('/', async (req, res) => {
    try {
        const { name, description } = req.body;

        if (!name) {
            return res.status(400).json({ error: 'Name is a required field' });
        }

        const id = crypto.randomUUID();

        const newCategory: Category = {
            id,
            name,
            description,
        };

        await fileDb.saveCategory(newCategory);

        res.json(newCategory);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/', async (_req, res) => {
    try {
        const categories = await fileDb.getCategories();

        res.json(categories);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router;
