import express from 'express';
import cors from 'cors';

const app = express();

// Middlewares básicos del servidor
app.use(cors());
app.use(express.json());

export default app;
