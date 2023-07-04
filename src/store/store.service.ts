import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UserCompany } from 'src/shared/models/user-company.model';
import { ProductPrice } from 'src/shared/models/product-price.model';
import { ProductImage } from 'src/shared/models/product-image.model';
import { Op, Sequelize } from 'sequelize';
import { Product } from 'src/shared/models/product.model';
import { ProductExtraInformation } from 'src/shared/models/product-extra-information.model';
import { Company } from 'src/shared/models/company.model';

@Injectable()
export class StoreService {
    constructor(
        @InjectModel(Product) private readonly productModel: typeof Product,
    ) { }

    async findAll(search_term: string) {
        let search_term_refined = search_term?.trim().split(/\s+/g).join(' or ');
        const clauseWhere = {
            [Op.or]: [
                {
                    name: {
                        [Op.match]: Sequelize.fn('websearch_to_tsquery', search_term_refined)
                    },
                },
                {
                    description: {
                        [Op.match]: Sequelize.fn('websearch_to_tsquery', search_term_refined)
                    },
                },
                {
                    '$user_company.company.name$': {
                        [Op.match]: Sequelize.fn('websearch_to_tsquery', search_term_refined)
                    }
                },
                {
                    '$extra_informations.key$': {
                        [Op.match]: Sequelize.fn('websearch_to_tsquery', search_term_refined)
                    }
                },
            ]
        }
        return await this.productModel.findAll({
            where: search_term && clauseWhere,
            include: [{
                model: UserCompany,
                include: [{
                    model: Company
                }]
            }, {
                model: ProductPrice,
                separate: true,
                order: [['amount', 'ASC']],
            }, {
                model: ProductImage,
                required: false,
                separate: true,
                order: [['path_src', 'ASC']],
            }, {
                model: ProductExtraInformation,
                required: false
            }],
            order: [['created_at', 'DESC']],
        });
    }

    async findBySlug(slug: string) {
        return await this.productModel.findOne({
            where: {
                slug
            },
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
            }, {
                model: ProductExtraInformation,
                required: false
            }]
        });
    }
}
