import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/* 
  Using LocalAuthGuard does two things
  1. The route handler will only be invoked if the user has been validated(since we are using LocalStrategy)
  2. Attaches the jwt returned to req as req.jwt
*/
@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}
