import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthPayload, OrderPayload, OrdersPayload, PATTERNS } from '@app/common';
import { UsersService } from './app.service';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @MessagePattern(PATTERNS.users.login)
  login(@Payload() payload: AuthPayload) {
    return this.usersService.login(payload);
  }

  @MessagePattern(PATTERNS.users.register)
  register(@Payload() payload: AuthPayload) {
    return this.usersService.register(payload);
  }

  @MessagePattern(PATTERNS.users.createOrder)
  createOrder(@Payload() payload: OrderPayload) {
    return this.usersService.createOrder(payload);
  }

  @MessagePattern(PATTERNS.users.orders)
  getOrders(@Payload() payload: OrdersPayload) {
    return this.usersService.getOrders(payload);
  }
}
