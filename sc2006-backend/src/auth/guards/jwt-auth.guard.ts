import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/* 
  Used for protected routes by checking if jwt exists. JWT is attached only after login() is called
*/
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
