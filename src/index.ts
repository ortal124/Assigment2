import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import postRoutes from './routes/postRouter';
import commentRoutes from './routes/commentRouter';
import userRoutes from './routes/userRouter';
import authRoutes from './routes/authRouter';
import swaggerUI from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";


const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

app.use('/post', postRoutes);
app.use('/comment', commentRoutes);
app.use('/users', userRoutes);
app.use('/auth', authRoutes);

const options = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Web Dev 2025 REST API",
        version: "1.0.0",
        description: "REST server including authentication using JWT",
      },
      servers: [{ url: "http://localhost:3000", },],
    },
    apis: ["./src/routes/*.ts"],
  };
const specs = swaggerJsDoc(options);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));

mongoose.connect('mongodb://localhost:27017/assignment2')
  .then(() => {
    console.log('Connected to MongoDB locally');
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);
  });