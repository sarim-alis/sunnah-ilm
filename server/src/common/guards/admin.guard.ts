import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { normalizeRole } from '../../users/roles';
import { UsersService } from '../../users/users.service';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private usersService: UsersService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<{ user?: { id: string } }>();
    const id = request.user?.id;
    if (!id) throw new ForbiddenException('Admin only');

    const user = await this.usersService.findById(id);
    if (normalizeRole(user?.role) !== 'admin') {
      throw new ForbiddenException('Admin only');
    }
    return true;
  }
}
