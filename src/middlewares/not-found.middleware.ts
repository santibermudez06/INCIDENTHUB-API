import { Request, Response, NextFunction } from 'express';

export const notFoundMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  res.status(404).json({
    ok: false,
    message: 'Route not found'
  });
};