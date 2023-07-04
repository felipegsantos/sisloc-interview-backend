import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Product } from 'src/shared/models/product.model';
import { ProductExtraInformation } from 'src/shared/models/product-extra-information.model';
import { ProductImage } from 'src/shared/models/product-image.model';
import { ProductPrice } from 'src/shared/models/product-price.model';

@Module({
  imports: [
    SequelizeModule.forFeature([Product, ProductExtraInformation, ProductImage, ProductPrice]),
  ],
  controllers: [CartController],
  providers: [CartService]
})
export class CartModule {}
