import { BelongsTo, Column, ForeignKey, Model, Table } from "sequelize-typescript";
import { Product } from "./product.model";

@Table({
    tableName: 'product_extra_informations',
    timestamps: false
})
export class ProductExtraInformation extends Model<ProductExtraInformation> {
    @ForeignKey(() => Product)
    @Column
    product_id: string;
    @BelongsTo(() => Product)
    product: typeof Product;
    
    @Column
    key: string;
    @Column
    value: string;
}