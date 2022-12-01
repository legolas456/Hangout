import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private readonly logger: Logger) {}

  use(req: Request, res: Response, next: NextFunction) {
    this.logger.log(
      `Req body: ${JSON.stringify(req.body)}`,
      `${req.method} ${req.path}`,
    );
    next();
  }
}
