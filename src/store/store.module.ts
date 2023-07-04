import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { StoreService } from './store.service';
import { StoreController } from './store.controller';
import { Product } from 'src/shared/models/product.model';
import { ProductExtraInformation } from 'src/shared/models/product-extra-information.model';
import { ProductImage } from 'src/shared/models/product-image.model';
import { ProductPrice } from 'src/shared/models/product-price.model';
import { ProductModule } from './product/product.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Product, ProductExtraInformation, ProductImage, ProductPrice]),
    ProductModule
  ],
  controllers: [StoreController],
  providers: [StoreService]
})
export class StoreModule {}
