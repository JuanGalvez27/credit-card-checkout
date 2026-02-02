import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CheckoutController } from './presentation/controllers/checkout.controller';
import { OnboardCheckoutUseCase } from './application/use-cases/onboard-checkout.use-case';
import { TypeOrmProductRepository } from './infrastructure/persistence/typeorm/repositories/product.repository';
import { MockPaymentGateway } from './infrastructure/adapters/payment/mock-payment.gateway';
import { ProductTypeORM } from './infrastructure/persistence/typeorm/entities/product.typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([ProductTypeORM])],
    controllers: [CheckoutController],
    providers: [
        OnboardCheckoutUseCase,
        {
            provide: 'ProductRepositoryPort',
            useClass: TypeOrmProductRepository,
        },
        {
            provide: 'PaymentGatewayPort',
            useClass: MockPaymentGateway,
        },
    ],
})
export class CheckoutModule { }
