import { Column, Model, Table } from "sequelize-typescript";

@Table({
    tableName: 'orders',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
})
export class Order extends Model<Order> {

    @Column
    product_id: string;
    @Column
    product_price_id: string;
    @Column
    product_raw: string;
    @Column
    session_cart: string;
    @Column
    payment_mode: string;
    @Column
    amount_paid: string;
    @Column
    status_alias: string;
}