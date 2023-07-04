import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from 'src/shared/models/user.model';
import { UserRole } from 'src/shared/models/user-role.model';
import { Role } from 'src/shared/models/role.model';

@Module({
  imports: [
    SequelizeModule.forFeature([User, UserRole, Role])
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
