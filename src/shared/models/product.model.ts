import { BeforeCreate, BeforeUpdate, BelongsTo, Column, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";
import { UserCompany } from "./user-company.model";
import { ProductPrice } from "./product-price.model";
import slugify from "../utils/slugify";
import { ProductImage } from "./product-image.model";
import { ProductExtraInformation } from "./product-extra-information.model";

@Table({
    tableName: 'products',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
})
export class Product extends Model<Product> {
    @ForeignKey(() => UserCompany)
    @Column
    user_company_id: string;
    @BelongsTo(() => UserCompany)
    user_company: typeof UserCompany;

    @Column
    sku: string;
    @Column
    name: string;
    @Column
    slug: string;
    @Column
    type: string;
    @Column
    description: string;
    @Column
    weight: string;
    @Column
    width: string;
    @Column
    height: string;
    @Column
    length: string;
    @Column
    status_alias: string;

    @HasMany(() => ProductImage)
    photos: ProductImage[];

    @HasMany(() => ProductPrice)
    prices: ProductPrice[];

    @HasMany(() => ProductExtraInformation)
    extra_informations: ProductExtraInformation[];

    @BeforeUpdate
    @BeforeCreate
    static slugProductName(model: Product) {
        if (model.name) {
            model.slug = slugify(model.name);
        }
    }
}