import { Column, HasOne, Model, Table } from "sequelize-typescript";
import { UserCompany } from "./user-company.model";

@Table({
    tableName: 'companies',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
})
export class Company extends Model<Company> {

    @Column
    name: string;
    @Column
    status_alias: string;

    @HasOne(() => UserCompany)
    user_company: UserCompany[];
}