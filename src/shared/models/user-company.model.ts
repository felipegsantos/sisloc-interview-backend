import { BelongsTo, Column, ForeignKey, Model, Table } from "sequelize-typescript";
import { User } from "./user.model";
import { Company } from "./company.model";

@Table({
    tableName: 'user_companies',
    timestamps: false
})
export class UserCompany extends Model<UserCompany> {

    @ForeignKey(() => User)
    @Column
    user_id: string;
    @BelongsTo(() => User)
    user: typeof User;

    @ForeignKey(() => Company)
    @Column
    company_id: string;
    @BelongsTo(() => Company)
    company: typeof Company;
}