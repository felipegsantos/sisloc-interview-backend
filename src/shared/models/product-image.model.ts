import { BelongsTo, Column, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import { Product } from "./product.model";

@Table({
    tableName: 'product_images',
    timestamps: false,
})
export class ProductImage extends Model<ProductImage> {
    @PrimaryKey
    @ForeignKey(() => Product)
    @Column
    product_id: string;
    @BelongsTo(() => Product)
    product: typeof Product;
    
    @PrimaryKey
    @Column
    path_src: string;
}