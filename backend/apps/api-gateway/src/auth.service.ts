import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, firstValueFrom, throwError } from 'rxjs';
import {
  AuthPayload,
  AuthResponse,
  CreateOrderPayload,
  CreateOrderResponse,
  OrdersResponse,
  PATTERNS,
  SERVICES,
} from '@app/common';

@Injectable()
export class AuthService {
  constructor(@Inject(SERVICES.users) private readonly usersClient: ClientProxy) {}

  login(payload: AuthPayload): Promise<AuthResponse> {
    return this.send(PATTERNS.users.login, payload);
  }

  register(payload: AuthPayload): Promise<AuthResponse> {
    return this.send(PATTERNS.users.register, payload);
  }

  createOrder(token: string, payload: CreateOrderPayload): Promise<CreateOrderResponse> {
    return this.send(PATTERNS.users.createOrder, {
      token,
      ...payload,
    });
  }

  getOrders(token: string): Promise<OrdersResponse> {
    return this.send(PATTERNS.users.orders, { token });
  }

  private send<TResponse>(pattern: string, payload: unknown): Promise<TResponse> {
    return firstValueFrom(
      this.usersClient.send<TResponse>(pattern, payload).pipe(
        catchError((error) => {
          const details = error?.error ?? error;
          const message = details?.message || 'Не удалось выполнить запрос';
          const statusCode = details?.statusCode;

          switch (statusCode) {
            case 400:
              return throwError(() => new BadRequestException(message));
            case 401:
              return throwError(() => new UnauthorizedException(message));
            case 409:
              return throwError(() => new ConflictException(message));
            default:
              return throwError(() => new InternalServerErrorException(message));
          }
        }),
      ),
    );
  }
}
