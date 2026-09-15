import { ArgumentsHost, Catch, HttpException } from '@nestjs/common';
import { BaseRpcExceptionFilter, RpcException } from '@nestjs/microservices';
import { status as GrpcStatus } from '@grpc/grpc-js';
import { Observable, throwError } from 'rxjs';
import { ProductNotFoundError } from '../../product/domain/product-not-found.error';

@Catch()
export class GrpcExceptionFilter extends BaseRpcExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): Observable<unknown> {
    if (exception instanceof ProductNotFoundError) {
      return throwError(
        () => new RpcException({ code: GrpcStatus.NOT_FOUND, message: exception.message }),
      );
    }

    if (exception instanceof RpcException) {
      return super.catch(exception, host);
    }

    if (exception instanceof Error && exception.name === 'CastError') {
      return throwError(
        () => new RpcException({ code: GrpcStatus.INVALID_ARGUMENT, message: 'Invalid product id' }),
      );
    }

    if (exception instanceof HttpException) {
      const response = exception.getResponse();
      const message =
        typeof response === 'string' ? response : ((response as { message?: unknown }).message ?? exception.message);
      return throwError(() => new RpcException({ code: GrpcStatus.INVALID_ARGUMENT, message }));
    }

    const message = exception instanceof Error ? exception.message : 'Internal server error';
    return throwError(() => new RpcException({ code: GrpcStatus.INTERNAL, message }));
  }
}
