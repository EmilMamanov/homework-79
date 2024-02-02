import multer from 'multer';
import { promises as fs } from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';
import config from './config';

const storage = (entity: string) => multer.diskStorage({
    destination: async (_req, _file, cb) => {
        const destDir = path.join(config.publicPath, 'images', entity);
        await fs.mkdir(destDir, { recursive: true });
        cb(null, destDir);
    },
    filename: (_req, file, cb) => {
        const extension = path.extname(file.originalname);
        const filename = randomUUID() + extension;
        cb(null, filename);
    },
});

export const uploadItemImage = multer({ storage: storage('items') });
