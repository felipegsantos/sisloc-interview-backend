import { Body, Controller, Delete, Get, Headers, Post } from '@nestjs/common';
import { CartService } from './cart.service';
import { Public } from 'src/shared/decorators/public.decorator';

@Controller('carts')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Public()
  @Get()
  async get(@Headers('X-Session-Cart') sessionCart: string) {
    return await this.cartService.get(sessionCart);
  }

  @Public()
  @Post()
  async addToCart(@Headers('X-Session-Cart') sessionCart: string, @Body() item: any) {
    return await this.cartService.append(sessionCart, item);
  }

  @Public()
  @Post('/increase')
  async increaseItem(@Headers('X-Session-Cart') sessionCart: string, @Body() item: any) {
    return await this.cartService.increaseItem(sessionCart, item);
  }

  @Public()
  @Delete('/remove')
  async removeToCart(@Headers('X-Session-Cart') sessionCart: string, @Body() item: any) {
    return await this.cartService.remove(sessionCart, item);
  }
}
