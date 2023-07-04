import { Column, Model, Table } from "sequelize-typescript";

@Table({
    tableName: 'roles'
})
export class Role extends Model<Role> {

    @Column
    name: string;
    @Column
    status_alias: string;
}