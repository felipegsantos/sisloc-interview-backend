import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { AuthDto } from './dto/auth.dto';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'src/shared/models/user.model';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User) private readonly userModel: typeof User,
        private readonly jwtService: JwtService
    ) { }

    private async validateUser(authDto: AuthDto) {
        const get_by_email = await this.userModel.findOne({
            attributes: ['id', 'name', 'email', 'password'],
            where: {
                email: authDto.email,
            },
        });
        if (!get_by_email) {
            throw new HttpException(
                'User or password invalid',
                HttpStatus.UNAUTHORIZED,
            );
        }

        const passwordIsValid = await this.comparePassword(
            authDto.password,
            get_by_email.password,
        );
        
        if (!passwordIsValid) {
            throw new HttpException(
                'User or password invalid',
                HttpStatus.UNAUTHORIZED,
            );
        }

        return get_by_email;
    }

    private async comparePassword(password: string, passwordEncrypted: string) {
        if (!passwordEncrypted) {
            throw new HttpException(
                'We send you an email with instructions to access your account',
                HttpStatus.UNAUTHORIZED,
            );
        }
        return await bcrypt.compare(password, passwordEncrypted);
    }

    async login(authDto: AuthDto) {
        try {
            const validUser = await this.validateUser(authDto);
            const payload = {
                name: validUser.name,
                email: validUser.email,
                sub: validUser.id,
            };
            return {
                ...payload,
                access_token: this.jwtService.sign(payload),
            };
        } catch (error) {
            throw error;
        }
    }
}
