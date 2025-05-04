import express, { Express } from 'express';
import { connectDB } from './config/database';


const app: Express = express();


connectDB();



export default app;

