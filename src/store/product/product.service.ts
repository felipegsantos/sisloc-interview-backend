import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from 'src/shared/models/product.model';
import { UserCompany } from 'src/shared/models/user-company.model';
import { ProductPrice } from 'src/shared/models/product-price.model';
import { ProductImage } from 'src/shared/models/product-image.model';

@Injectable()
export class ProductService {
  constructor(
    private readonly sequelize: Sequelize,
    @InjectModel(Product) private readonly productModel: typeof Product,
    @InjectModel(ProductPrice) private readonly productPriceModel: typeof ProductPrice,
    @InjectModel(ProductImage) private readonly productImageModel: typeof ProductImage,
  ) { }

  async getMedias(model_id: string) {
    return await this.productImageModel.findAll({
      where: {
        product_id: model_id
      }
    });
  }

  async viewMedia(media_path: string) {
    return await this.productImageModel.findOne({
      where: {
        path_src: media_path
      }
    });
  }

  async uploadPhoto(model_id: string, file: any) {
    try {
      const { destination, filename } = file;
      const attachPhoto = {
        path_src: destination + filename,
        product_id: model_id
      }
      return await this.productImageModel.create(attachPhoto);
    } catch (error) {
      console.log(error)
    }
  }

  async create(createProductDto: CreateProductDto) {
    return await this.productModel.create({ ...createProductDto, status_alias: 'approved' });
  }

  async findAll(user_id: string) {
    return await this.productModel.findAll({
      include: [{
        model: UserCompany,
        where: {
          user_id
        }
      }, {
        model: ProductPrice,
        separate: true,
        order: [['amount', 'ASC']],
      }, {
        model: ProductImage,
        required: false,
        separate: true,
        order: [['path_src', 'ASC']],
      }],
      order: [['created_at', 'DESC']],
    });
  }

  async findOne(id: string) {
    return await this.productModel.findByPk(id, {
      include: [{
        model: UserCompany,
      }, {
        model: ProductPrice,
        separate: true,
        order: [['amount', 'ASC']],
      }, {
        model: ProductImage,
        required: false,
        separate: true,
        order: [['path_src', 'ASC']],
      }]
    });
  }

  async update(id: string, data: any) {
    try {
      return await this.sequelize.transaction(async (__t) => {
        const found = await this.productModel.findOne({
          where: {
            id
          },
          transaction: __t
        });
        const updated = await found.update(data, { transaction: __t });

        await this.productPriceModel.destroy({
          where: {
            product_id: found.id
          },
          transaction: __t
        });

        for await (const price of data.prices || []) {
          await this.productPriceModel.upsert({
            product_id: found.id,
            amount: price.amount,
            rent_billing_mode: price.rent_billing_mode
          }, {
            transaction: __t,
          })
        }

        return updated;
      })
    } catch (error) {
      console.log(error)
    }
  }

  async remove(id: number) {
    const found = await this.productModel.findOne({
      where: {
        id
      }
    });
    await found.destroy();
    return { id: found.id, message: 'produto deletado com sucesso' }
  }
}
