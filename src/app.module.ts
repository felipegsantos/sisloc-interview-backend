import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';
import { AuthModule } from './auth/auth.module';
import { CartModule } from './cart/cart.module';
import { ChargeModule } from './charge/charge.module';
import { JwtAuthGuard } from './auth/guards/auth.guard';
import { UserModule } from './user/user.module';
import { CompanyModule } from './company/company.module';
import { UniqueOnDatabaseExistConstraint } from './shared/validators/unique.validator';
import { StoreModule } from './store/store.module';
import { RedisOptions } from '@nestjs/microservices';

const AuthGuardProvider = {
  provide: APP_GUARD,
  useClass: JwtAuthGuard,
}

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
    }),
    SequelizeModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        dialect: 'postgres',
        host: configService.get('DB_HOST'),
        port: Number(configService.get('DB_PORT')),
        username: configService.get('DB_USER'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        autoLoadModels: true,
        logging: false,
        dialectOptions: {
          ssl: process.env.NODE_ENV === 'production' && {
            require: true,
            rejectUnauthorized: false
          }
        }
      }),
      inject: [ConfigService],
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: (configService: ConfigService) => <RedisOptions>({
        store: redisStore,
        host: configService.get('REDIS_HOST'),
        // username: configService.get('REDIS_USER'),
        // password: configService.get('REDIS_PASSWORD'),
        port: configService.get('REDIS_PORT'),
        // tls: {},
        ttl: 86400,
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    StoreModule,
    CartModule,
    ChargeModule,
    UserModule,
    CompanyModule
  ],
  controllers: [],
  providers: [
    AuthGuardProvider,
    UniqueOnDatabaseExistConstraint
  ],
})
export class AppModule { }