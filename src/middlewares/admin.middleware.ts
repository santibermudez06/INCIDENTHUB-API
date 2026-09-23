import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/app-error';

export const adminMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const user = (req as any).user;

  if (!user || user.role !== 'admin') {
    return next(new AppError(403, 'Forbidden: Admin access required'));
  }

  next();
};