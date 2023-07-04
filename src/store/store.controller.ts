import { Controller, Get, Param, Query } from '@nestjs/common';
import { StoreService } from './store.service';
import { Public } from 'src/shared/decorators/public.decorator';

@Controller('store/products')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Public()
  @Get()
  async findAll(@Query('search') search_term: string) {
    return await this.storeService.findAll(search_term);
  }

  @Public()
  @Get(':slug')
  async findBySlug(@Param('slug') slug: string) {
    return await this.storeService.findBySlug(slug);
  }
}
