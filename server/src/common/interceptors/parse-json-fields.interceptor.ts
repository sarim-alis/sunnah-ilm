import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';

function parseJsonField(value: unknown) {
  if (typeof value !== 'string') return value;
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

@Injectable()
export class ParseJsonFieldsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const req = context.switchToHttp().getRequest<{
      body?: Record<string, unknown>;
    }>();
    if (req.body && typeof req.body.preferences === 'string') {
      req.body.preferences = parseJsonField(req.body.preferences);
    }
    return next.handle();
  }
}
