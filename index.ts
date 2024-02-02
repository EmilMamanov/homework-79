import express from 'express';
import fileDb from './fileDb';
import cors from 'cors';
import categoriesRoutes from "./routes/categoriesRoutes";
import itemsRoutes from "./routes/itemsRoutes";
import locationsRoutes from "./routes/locationsRoutes";

const app = express();
const port = 8000;

app.use(express.json());

app.use(cors());

app.use('/categories', categoriesRoutes);
app.use('/locations', locationsRoutes);
app.use('/items', itemsRoutes);


const run = async () => {
    await fileDb.init();

    app.listen(port, () => {
        console.log(`Server started on ${port} port!`);
    });
};

void run();

