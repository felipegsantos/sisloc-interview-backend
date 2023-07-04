import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { Product } from 'src/shared/models/product.model';
import { ProductPrice } from 'src/shared/models/product-price.model';
import { ProductExtraInformation } from 'src/shared/models/product-extra-information.model';
import { ProductImage } from 'src/shared/models/product-image.model';

@Module({
  imports: [
    SequelizeModule.forFeature([Product, ProductExtraInformation, ProductImage, ProductPrice]),
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
