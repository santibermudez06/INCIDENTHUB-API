import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/app-error';

const validPriorities = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];

export const validatePriority = (req: Request, res: Response, next: NextFunction): void => {
  const { priority } = req.body;

  if (priority && !validPriorities.includes(priority)) {
    return next(new AppError(400, 'Invalid priority value. Must be LOW, MEDIUM, HIGH, or CRITICAL'));
  }

  next();
};