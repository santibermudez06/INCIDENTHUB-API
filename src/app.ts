import express, { Application } from 'express';
import incidentRoutes from './routes/incident.routes';
import { loggerMiddleware } from './middlewares/logger.middleware';
import { requestInfoMiddleware } from './middlewares/request-info.middleware';
import { errorMiddleware } from './middlewares/error.middleware';
import { notFoundMiddleware } from './middlewares/not-found.middleware';

const app: Application = express();

app.use(express.json());
app.use(loggerMiddleware);
app.use(requestInfoMiddleware);

// Rutas base
app.use('/api/incidents', incidentRoutes);

// Manejo de rutas inexistentes y errores globales
app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;