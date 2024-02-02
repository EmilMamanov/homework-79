import express, { Router } from 'express';
import { Item } from '../types';
import fileDb from '../fileDb';
import { uploadItemImage } from '../multer';
import crypto from 'crypto';

const router: Router = express.Router();

router.get('/', async (_req, res) => {
    try {
        const items = await fileDb.getItems();
        const simplifiedItems = items.map(({ id, name }) => ({ id, name }));
        res.json(simplifiedItems);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const itemId = req.params.id;
        const item = await fileDb.getItemById(itemId);

        if (!item) {
            return res.status(404).json({ error: 'Item not found' });
        }

        res.json(item);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/', uploadItemImage.single('image'), async (req, res) => {
    try {
        const { categoryId, locationId, name, description } = req.body;

        if (!categoryId || !locationId || !name) {
            return res.status(400).json({ error: 'Category ID, Location ID, and Name are required fields' });
        }

        const id = crypto.randomUUID();

        const newItem: Item = {
            id,
            categoryId,
            locationId,
            name,
            description,
            image: req.file ? req.file.filename : null,
        };

        await fileDb.saveItem(newItem);

        res.json(newItem);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const itemId = req.params.id;

        const item = await fileDb.getItemById(itemId);
        if (!item) {
            return res.status(404).json({ error: 'Item not found' });
        }


        await fileDb.deleteItem(itemId);

        res.json({ message: 'Item deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const itemId = req.params.id;
        const { categoryId, locationId, name, description } = req.body;

        if (!categoryId || !locationId || !name) {
            return res.status(400).json({ error: 'Category ID, Location ID, and Name are required fields' });
        }

        const updatedItem = await fileDb.updateItem(itemId, {
            categoryId,
            locationId,
            name,
            description,
        });

        if (!updatedItem) {
            return res.status(404).json({ error: 'Item not found' });
        }

        res.json(updatedItem);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router;
