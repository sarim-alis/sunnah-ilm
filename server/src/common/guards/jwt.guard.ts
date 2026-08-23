import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../users/users.service';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<{
      headers: { authorization?: string };
      user?: { id: string; email: string; role?: string };
    }>();
    const header = request.headers.authorization;
    if (!header?.startsWith('Bearer ')) {
      throw new UnauthorizedException('No token, authorization denied');
    }

    try {
      const payload = await this.jwtService.verifyAsync<{
        id: string;
        email: string;
        role?: string;
      }>(header.slice(7));
      const user = await this.usersService.findById(payload.id);
      if (!user) {
        throw new UnauthorizedException('Token is not valid');
      }
      request.user = payload;
      return true;
    } catch (err) {
      if (err instanceof UnauthorizedException) throw err;
      throw new UnauthorizedException('Token is not valid');
    }
  }
}
