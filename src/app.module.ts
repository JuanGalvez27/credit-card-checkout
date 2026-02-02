import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionModule } from './transaction.module';
import { TypeOrmConfigService } from './infrastructure/persistence/typeorm/typeorm.config';
import { ProductModule } from './product.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
      imports: [ConfigModule],
    }),
    ProductModule,
    TransactionModule
  ],
  providers: [TypeOrmConfigService]
})
export class AppModule { }
