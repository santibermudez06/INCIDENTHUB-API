import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/app-error';

export const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      ok: false,
      message: err.message
    });
    return;
  }

  console.error('Unhandled Error:', err);

  res.status(500).json({
    ok: false,
    message: 'Internal server error'
  });
};