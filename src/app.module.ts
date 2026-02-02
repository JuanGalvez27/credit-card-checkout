import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmConfigService } from './infrastructure/persistence/typeorm/typeorm.config';
import { ProductTypeORM } from './infrastructure/persistence/typeorm/entities/product.typeorm';
import { SeedingService } from './seeding.service';
import { CheckoutModule } from './checkout.module';
import { ProductModule } from './product.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
    TypeOrmModule.forFeature([ProductTypeORM]),
    CheckoutModule,
    ProductModule,
  ],
  controllers: [AppController],
  providers: [AppService, SeedingService, TypeOrmConfigService],
})
export class AppModule { }
