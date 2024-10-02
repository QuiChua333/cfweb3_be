import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

export function loggerFunctionMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  console.log('Logger middle ware');
  next();
}
