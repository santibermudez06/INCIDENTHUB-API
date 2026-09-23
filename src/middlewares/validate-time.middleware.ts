import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/app-error';

export const validateTime = (req: Request, res: Response, next: NextFunction): void => {
  const { estimatedMinutes, priority } = req.body;

  if (estimatedMinutes !== undefined) {
    if (typeof estimatedMinutes !== 'number' || estimatedMinutes <= 0 || estimatedMinutes > 480) {
      return next(new AppError(400, 'estimatedMinutes must be a number greater than 0 and up to 480'));
    }

    // Reto 4 - Regla especial para incidentes críticos (máximo 60 min)
    if (priority === 'CRITICAL' && estimatedMinutes > 60) {
      return next(new AppError(400, 'CRITICAL priority incidents cannot exceed 60 estimated minutes'));
    }
  }

  next();
};