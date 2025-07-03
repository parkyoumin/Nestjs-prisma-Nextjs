import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { BYPASS_AUTH_KEY } from "../decorators/bypass-auth.decorator";

export interface UnifiedResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, UnifiedResponse<T>>
{
  constructor(private reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const isBypassAuth = this.reflector.getAllAndOverride<boolean>(
      BYPASS_AUTH_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (isBypassAuth) {
      return next.handle();
    }

    return next.handle().pipe(
      map((data) => ({
        success: true,
        message: "요청에 성공했습니다.", // TODO: 추후 메시지는 동적으로 변경 가능
        data: data || null,
      })),
    );
  }
}
