import { Module } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Company } from 'src/shared/models/company.model';
import { UserCompany } from 'src/shared/models/user-company.model';

@Module({
  imports: [
    SequelizeModule.forFeature([Company, UserCompany])
  ],
  controllers: [CompanyController],
  providers: [CompanyService]
})
export class CompanyModule {}
