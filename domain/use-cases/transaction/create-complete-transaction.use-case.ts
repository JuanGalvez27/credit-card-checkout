import { Inject, Injectable } from '@nestjs/common';
import { Either, left, right } from 'fp-ts/lib/Either';
import { CreateTransactionDto } from '../../../src/application/dto/transaction.dto';
import type { ProductRepositoryPort } from '../../../src/application/ports/out/product-repository.port';
import type { PaymentGatewayPort } from '../../../src/application/ports/out/payment-gateway.port';
import type { TransactionRepositoryPort } from '../../../src/application/ports/out/transaction-repository.port';
import { Transaction } from '../../entities/transaction';
import { TransactionStatus, TransactionStep } from '../../enums/transaction.enum';
import { DomainError, ProductNotFoundError } from '../../errors/domain.error';
import { randomUUID } from 'crypto';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class CreateCompleteTransactionUseCase {
    constructor(
        @Inject('ProductRepositoryPort')
        private readonly productRepository: ProductRepositoryPort,
        @Inject('PaymentGatewayPort')
        private readonly paymentGateway: PaymentGatewayPort,
        @Inject('TransactionRepositoryPort')
        private readonly transactionRepository: TransactionRepositoryPort,
        private readonly configService: ConfigService,
    ) { }

    async execute(dto: CreateTransactionDto): Promise<Either<DomainError, Transaction>> {
        try {
            // Step 1: Validate product exists
            const product = await this.productRepository.findById(dto.productId);
            if (!product) {
                return left(new ProductNotFoundError(dto.productId));
            }

            // Step 2: Create transaction in DB with PENDING status
            const transactionId = randomUUID();
            const reference = `REF_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            const transaction = new Transaction(
                transactionId,
                TransactionStatus.PENDING,
                TransactionStep.PAYMENT_INFO,
                dto.productId,
                dto.amount,
                dto.baseFee,
                dto.deliveryFee,
                new Date(),
                new Date(),
                dto.customerId,
                undefined, // wompiTransactionId - will be set after external creation
                reference, // wompiReference
            );

            const savedTransaction = await this.transactionRepository.save(transaction);

            try {
                // Step 3: Tokenize card
                const cardTokenResult = await this.paymentGateway.tokenizeCard({
                    number: dto.cardNumber,
                    cvc: dto.cardCvc,
                    expMonth: dto.cardExpMonth,
                    expYear: dto.cardExpYear,
                    cardHolder: dto.cardHolder,
                });

                // Step 4: Get acceptance token
                const acceptanceTokenResult = await this.paymentGateway.getAcceptanceToken();

                // Step 5: Create payment source
                const paymentSourceResult = await this.paymentGateway.createPaymentSource({
                    type: 'CARD',
                    token: cardTokenResult.token,
                    customer_email: dto.customerEmail,
                    acceptance_token: acceptanceTokenResult.acceptance_token,
                });

                // Step 7: Create transaction in Wompi
                const wompiTransactionResult = await this.paymentGateway.createTransaction({
                    amount_in_cents: dto.amount,
                    currency: product.currency,
                    customer_email: dto.customerEmail,
                    payment_method: {
                        installments: dto.installments || 1,
                    },
                    reference: reference,
                    payment_source_id: paymentSourceResult.id,
                });

                // Step 8: Update transaction in DB with Wompi transaction ID
                const updatedTransaction = await this.transactionRepository.update(
                    savedTransaction.id,
                    {
                        wompiTransactionId: wompiTransactionResult.id,
                        status: wompiTransactionResult.status === 'APPROVED'
                            ? TransactionStatus.SUCCESS
                            : TransactionStatus.PENDING,
                        step: TransactionStep.FINAL_STATUS,
                    },
                );

                if (!updatedTransaction) {
                    return left(new DomainError('Failed to update transaction after Wompi creation'));
                }

                return right(updatedTransaction);
            } catch (error) {
                // If Wompi transaction fails, update local transaction status
                await this.transactionRepository.update(savedTransaction.id, {
                    status: TransactionStatus.FAILED,
                    step: TransactionStep.FINAL_STATUS,
                });

                return left(new DomainError(`Payment processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`));
            }
        } catch (error) {
            return left(new DomainError(`Transaction creation failed: ${error instanceof Error ? error.message : 'Unknown error'}`));
        }
    }
}

