import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import postRoutes from './routes/postRouter';
import commentRoutes from './routes/commentRouter';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req: Request, res: Response) => {
    res.send('Hello, Express with Local MongoDB!');
});

const MONGO_URI = "mongodb://localhost:27017/assignment2";

mongoose.connect(MONGO_URI, { dbName: 'assignment2'})
    .then(() => {
        console.log('Connected to MongoDB locally');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error.message);
    });

app.use('/post', postRoutes);
app.use('/comment', commentRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});