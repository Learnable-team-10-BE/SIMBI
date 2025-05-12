import { Request, Response, NextFunction } from 'express';

const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction): void => {
  console.error('Error Stack:', err.stack);
  console.error('Error Details:', {
    message: err.message,
    name: err.name,
    path: req.path,
    method: req.method,
    body: req.body
  });


  res.status(500).json({ 
    error: 'Server error',
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};

export default errorHandler;