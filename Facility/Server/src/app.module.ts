import { CacheInterceptor, CacheModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ConfigModule, ConfigService } from '@nestjs/config';

import { ClassificationModule } from './classification/classification.module';
import { ConnectionEnums } from './common/const/connection.enum';
import { I18nModule, I18nJsonParser } from 'nestjs-i18n';
import * as path from 'path';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { HttpExceptionFilter } from './common/exceptionFilters/exception.filter';

import * as Joi from 'joi';
import { MulterModule } from '@nestjs/platform-express';

import type { RedisClientOptions } from 'redis';
import * as redisStore from 'cache-manager-redis-store';
import { KeycloakModule } from './classification/keyclock.module';
import { PreClassificationModule } from './classification/pre-classification.module';

@Module({
  imports: [
    MulterModule.register({
      dest: './upload',
    }),

    KeycloakModule,
    I18nModule.forRoot({
      fallbackLanguage: 'tr',
      fallbacks: {
        en: 'en',
        tr: 'tr',
      },
      parser: I18nJsonParser,
      parserOptions: {
        path: path.join(__dirname, '/i18n/'),
      },
    }),

    MongooseModule.forRootAsync({
      connectionName: ConnectionEnums.PRECLASSIFICATION,
      useFactory: (config: ConfigService) => ({
        uri: config.get('DATABASE_LINK'),
        dbName: config.get('CLASSIFICATION_DB_NAME1'),
        user: config.get('DB_USER'),
        pass: config.get('DB_PASS'),
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forRootAsync({
      connectionName: ConnectionEnums.CLASSIFICATION,
      useFactory: (config: ConfigService) => ({
        uri: config.get('DATABASE_LINK'),
        dbName: config.get('CLASSIFICATION_DB_NAME2'),
        user: config.get('DB_USER'),
        pass: config.get('DB_PASS'),
      }),
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        DATABASE_LINK: Joi.string().required(),
      }),
    }),

    ClassificationModule, PreClassificationModule,


  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: CacheInterceptor,
    // },
  ],
})
export class AppModule {}
