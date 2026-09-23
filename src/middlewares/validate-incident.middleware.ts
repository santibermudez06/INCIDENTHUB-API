import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/app-error';

export const validateIncident = (req: Request, res: Response, next: NextFunction): void => {
  const { title, description, reporter, location, priority, estimatedMinutes } = req.body;

  if (!title || typeof title !== 'string' || title.trim() === '') {
    return next(new AppError(400, 'Title is required and must be a valid string'));
  }

  if (!description || typeof description !== 'string' || description.trim() === '') {
    return next(new AppError(400, 'Description is required and must be a valid string'));
  }

  if (!reporter || typeof reporter !== 'string' || reporter.trim() === '') {
    return next(new AppError(400, 'Reporter is required and must be a valid string'));
  }

  if (!location || typeof location !== 'string' || location.trim() === '') {
    return next(new AppError(400, 'Location is required and must be a valid string'));
  }

  if (!priority) {
    return next(new AppError(400, 'Priority is required'));
  }

  if (estimatedMinutes === undefined) {
    return next(new AppError(400, 'estimatedMinutes is required'));
  }

  next();
};