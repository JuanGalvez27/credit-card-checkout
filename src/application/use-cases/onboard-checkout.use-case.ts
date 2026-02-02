import { Inject, Injectable } from '@nestjs/common';
import { Either, left, right } from 'fp-ts/lib/Either';
import { CheckoutDto, CheckoutResponseDto } from '../dto/checkout.dto';
import type { ProductRepositoryPort } from '../ports/out/product-repository.port';
import type { PaymentGatewayPort } from '../ports/out/payment-gateway.port';
import { DomainError, ProductNotFoundError, PaymentFailedError } from '../../domain/errors/domain.error';

@Injectable()
export class OnboardCheckoutUseCase {
    constructor(
        @Inject('ProductRepositoryPort')
        private readonly productRepository: ProductRepositoryPort,
        @Inject('PaymentGatewayPort')
        private readonly paymentGateway: PaymentGatewayPort,
    ) { }

    async execute(dto: CheckoutDto): Promise<Either<DomainError, CheckoutResponseDto>> {
        const product = await this.productRepository.findById(dto.productId);

        if (!product) {
            return left(new ProductNotFoundError(dto.productId));
        }

        // Business Logic: Check currency match (optional, but good practice)
        if (product.currency !== dto.currency) {
            // Simple currency check
            // For now assuming the gateway handles conversion or we error out
        }

        const paymentResult = await this.paymentGateway.processPayment(
            product.price,
            dto.currency,
            dto.creditCardToken,
        );

        if (!paymentResult.success) {
            return left(new PaymentFailedError(paymentResult.error || 'Unknown error'));
        }

        return right({
            success: true,
            transactionId: paymentResult.transactionId,
            message: 'Payment processed successfully',
        });
    }
}
