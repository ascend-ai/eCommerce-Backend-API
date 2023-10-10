import express, { NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
import colors from 'colors'
import { Server } from 'http';
import morgan from 'morgan';

import { connectToDatabase } from './config';
import { outcomeHandler } from './api/v1/shared';
import { authRoute, productsRoute } from './api/v1/routes';
import { CustomError } from './api/v1/shared';
import path from 'path';

dotenv.config();
colors.enable();
const app = express();
const { PORT, MODE, PUBLIC_DIRECTORY_PATH } = <Record<string, string>>process.env;
let server: Server;

app.use(morgan('dev'));
app.use(express.static(PUBLIC_DIRECTORY_PATH));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1/auth', authRoute);

app.use('/api/v1/products', productsRoute);
app.all('*', (req: Request, res: Response, next: NextFunction) => {
  next(new CustomError(`404 - Not Found`, 404))
});

app.use(outcomeHandler);



connectToDatabase()
  .then(() => server = app.listen(PORT, () => console.log(`Server is running in ${MODE} mode on port ${PORT}`.yellow.bold)));

process.on('unhandledRejection', (error: Error, promise) => {
  console.log(`${error.name}: ${error.message}`.red);
  server?.close(() => process.exit(1));
});





