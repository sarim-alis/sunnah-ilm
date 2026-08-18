import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<{
      headers: { authorization?: string };
      user?: { id: string; email: string };
    }>();
    const header = request.headers.authorization;
    if (!header?.startsWith('Bearer ')) {
      throw new UnauthorizedException('No token, authorization denied');
    }

    try {
      const payload = await this.jwtService.verifyAsync<{
        id: string;
        email: string;
      }>(header.slice(7));
      request.user = payload;
      return true;
    } catch {
      throw new UnauthorizedException('Token is not valid');
    }
  }
}
