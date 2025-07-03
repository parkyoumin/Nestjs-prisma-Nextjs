import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

export interface UnifiedResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, UnifiedResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<UnifiedResponse<T>> {
    return next.handle().pipe(
      map((data) => ({
        success: true,
        message: "요청에 성공했습니다.", // TODO: 추후 메시지는 동적으로 변경 가능
        data: data || null,
      })),
    );
  }
}
