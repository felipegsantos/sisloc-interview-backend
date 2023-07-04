import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Company } from 'src/shared/models/company.model';
import { Sequelize } from 'sequelize-typescript';
import { UserCompany } from 'src/shared/models/user-company.model';

@Injectable()
export class CompanyService {
  constructor(
    @InjectModel(Company) private readonly companyModel: typeof Company,
    @InjectModel(UserCompany) private readonly userCompanyModel: typeof UserCompany,
    private readonly sequelize: Sequelize,
  ) { }

  async create(o: { user_id: string, createCompanyDto: CreateCompanyDto }) {
    return this.sequelize.transaction(async (__t) => {
      const created = await this.companyModel.create({ ...o.createCompanyDto, status_alias: 'approved' }, { transaction: __t });
      await this.userCompanyModel.create({ user_id: o.user_id, company_id: created.id }, { transaction: __t });
      return created;
    });

  }

  async findAll(user_id: string) {
    return await this.companyModel.findAll({
      include: [{
        model: UserCompany,
        where: {
          user_id
        }
      }]
    });
  }

  async findOne(id: number) {
    return await this.companyModel.findOne({
      where: { id }
    });
  }

  async update(id: number, updateCompanyDto: UpdateCompanyDto) {
    const found = await this.companyModel.findOne({
      where: { id }
    });

    return await found.update(updateCompanyDto);
  }

  async remove(id: number) {
    const found = await this.companyModel.findOne({
      where: { id }
    });

    await found.destroy();
    return { id: found.id, message: 'empresa deletada com sucesso' }
  }
}
