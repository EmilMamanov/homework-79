    import express, { Router } from 'express';
    import { Location } from '../types';
    import fileDb from '../fileDb';
    import crypto from 'crypto';

    const router: Router = express.Router();

    router.get('/', async (_req, res) => {
        try {
            const locations = await fileDb.getLocations();
            const simplifiedLocations = locations.map(({ id, name }) => ({ id, name }));
            res.json(simplifiedLocations);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });

    router.get('/:id', async (req, res) => {
        try {
            const locationId = req.params.id;
            const location = await fileDb.getLocationById(locationId);

            if (!location) {
                return res.status(404).json({ error: 'Location not found' });
            }

            res.json(location);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });

    router.post('/', async (req, res) => {
        try {
            const { name, description } = req.body;

            if (!name) {
                return res.status(400).json({ error: 'Name is a required field' });
            }

            const id = crypto.randomUUID();

            const newLocation: Location = {
                id,
                name,
                description,
            };

            await fileDb.saveLocation(newLocation);

            res.json(newLocation);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });

    router.delete('/:id', async (req, res) => {
        try {
            const locationId = req.params.id;

            const location = await fileDb.getLocationById(locationId);
            if (!location) {
                return res.status(404).json({ error: 'Location not found' });
            }


            await fileDb.deleteLocation(locationId);

            res.json({ message: 'Location deleted successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });

    router.put('/:id', async (req, res) => {
        try {
            const locationId = req.params.id;
            const { name, description } = req.body;

            if (!name) {
                return res.status(400).json({ error: 'Name is a required field' });
            }

            const updatedLocation = await fileDb.updateLocation(locationId, {
                name,
                description,
            });

            if (!updatedLocation) {
                return res.status(404).json({ error: 'Location not found' });
            }

            res.json(updatedLocation);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });

    export default router;
