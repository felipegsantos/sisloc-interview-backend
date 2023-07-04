import { BelongsTo, Column, ForeignKey, Model, Table } from "sequelize-typescript";
import { Product } from "./product.model";

@Table({
    tableName: 'product_prices',
    timestamps: false
})
export class ProductPrice extends Model<ProductPrice> {
    @ForeignKey(() => Product)
    @Column
    product_id: string;
    @BelongsTo(() => Product)
    product: typeof Product;
    
    @Column
    amount: string;
    @Column
    rent_billing_mode: string;
}