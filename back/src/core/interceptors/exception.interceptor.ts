import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { CallHandler, ExecutionContext, HttpException, HttpStatus, Injectable, NestInterceptor } from '@nestjs/common';

// @Injectable()
// export class ErrorsInterceptor implements NestInterceptor {
//   intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
//     return next.handle().pipe(catchError((err: any) => throwError(() => new HttpException(`${err}`, HttpStatus.BAD_GATEWAY))));
//   }
// }
