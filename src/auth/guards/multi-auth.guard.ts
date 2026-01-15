import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class MultiAuthGuard extends AuthGuard(['jwt', 'api-key', 'basic']) {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    // If no user is found with any strategy, throw an error
    if (err || !user) {
      throw err || new UnauthorizedException(
        'Authentication required. Please provide valid Bearer token, API Key (X-API-Key header), or Basic Auth credentials',
      );
    }
    return user;
  }
}
