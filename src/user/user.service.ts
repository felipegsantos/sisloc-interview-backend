import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from 'src/shared/models/user.model';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User) private readonly userModel: typeof User,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const created = await this.userModel.create({ ...createUserDto, status_alias: 'approved' });
    return { message: 'Usuário criado com sucesso' };
  }

  async findOne(id: number) {
    return await this.userModel.findOne({
      where: { id }
    });
  }
}
