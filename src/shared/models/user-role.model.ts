import { BelongsTo, Column, ForeignKey, Model, Table } from "sequelize-typescript";
import { User } from "./user.model";
import { Role } from "./role.model";

@Table({
    tableName: 'user_roles'
})
export class UserRole extends Model<UserRole> {

    @ForeignKey(() => User)
    @Column
    user_id: string;
    @BelongsTo(() => User)
    user: typeof User;

    @ForeignKey(() => Role)
    @Column
    role_id: string;
    @BelongsTo(() => Role)
    role: typeof Role;
}