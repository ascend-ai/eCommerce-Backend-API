import express, { NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
import { connectToDatabase } from './config';
import colors from 'colors'
import { Server } from 'http';
import { authRoute, productsRoute } from './api/v1/routes';
import morgan from 'morgan';
import { isAuthenticated, outcomeHandler } from './api/v1/shared/middlewares';
import { CustomError } from './api/v1/shared/utility-classes';

dotenv.config();
colors.enable();
const app = express();
const { PORT, MODE } = process.env;
let server: Server;

app.use(morgan('dev'));

// Payload as application/json
app.use(express.json());

// Payload as application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1/auth', authRoute);

app.use(isAuthenticated);
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





