import * as bcrypt from "bcrypt";
import { BeforeCreate, BeforeUpdate, Column, DefaultScope, Model, Table } from "sequelize-typescript";

@DefaultScope(() => ({
    attributes: { exclude: ['password'] },
}))

@Table({
    tableName: 'users',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
})
export class User extends Model<User> {

    @Column
    name: string;
    @Column
    email: string;
    @Column
    password: string;
    @Column
    status_alias: string;

    @BeforeUpdate
    @BeforeCreate
    static hashPassword(model: User) {
        if (model.password) {
            model.password = bcrypt.hashSync(model.password, 10);
        }
    }
}