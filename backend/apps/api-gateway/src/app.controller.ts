import { Body, Controller, Get, Headers, Param, Post, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateOrderDto, NewsletterDto } from './dto';
import { HomeService } from './home.service';

@Controller()
export class AppController {
  constructor(
    private readonly homeService: HomeService,
    private readonly authService: AuthService,
  ) {}

  @Get('health')
  getHealth() {
    return {
      service: 'api-gateway',
      status: 'ok',
    };
  }

  @Get('home')
  getHome() {
    return this.homeService.getHome();
  }

  @Get('products')
  getProducts() {
    return this.homeService.getProducts();
  }

  @Get('products/:slug')
  getProduct(@Param('slug') slug: string) {
    return this.homeService.getProductBySlug(slug);
  }

  @Post('newsletter')
  subscribe(@Body() body: NewsletterDto) {
    return this.homeService.subscribe(body.email);
  }

  @Get('orders')
  getOrders(@Headers('authorization') authorization?: string) {
    return this.authService.getOrders(this.extractToken(authorization));
  }

  @Post('orders')
  createOrder(
    @Headers('authorization') authorization: string | undefined,
    @Body() body: CreateOrderDto,
  ) {
    return this.authService.createOrder(this.extractToken(authorization), body);
  }

  private extractToken(authorization?: string) {
    if (!authorization?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Требуется авторизация');
    }

    return authorization.slice('Bearer '.length).trim();
  }
}
