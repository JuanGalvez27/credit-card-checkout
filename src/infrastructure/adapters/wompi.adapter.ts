import { Injectable } from '@nestjs/common';
import {
    PaymentGatewayPort,
    CreateCardTokenInput,
    CardTokenResult,
    AcceptanceTokenResult,
    CreatePaymentSourceInput,
    PaymentSourceResult,
    CreateTransactionInput,
    TransactionResult,
} from '../../application/ports/out/payment-gateway.port';
import { WompiHttpClient } from './wompi.http-client';
import { WompiMapper } from './wompi.mapper';
import { ConfigService } from '@nestjs/config';
import { WompiSignatureUtil } from './wompi-signature.util';

@Injectable()
export class WompiAdapter implements PaymentGatewayPort {
    constructor(
        private readonly wompiHttpClient: WompiHttpClient,
        private readonly configService: ConfigService,
    ) { }

    async tokenizeCard(input: CreateCardTokenInput): Promise<CardTokenResult> {
        const wompiRequest = WompiMapper.toWompiRequest(input);
        const wompiResponse = await this.wompiHttpClient.tokenizeCard(wompiRequest);
        return WompiMapper.toCardTokenResult(wompiResponse);
    }

    async getAcceptanceToken(): Promise<AcceptanceTokenResult> {
        const wompiResponse = await this.wompiHttpClient.getAcceptanceToken();
        return WompiMapper.toAcceptanceTokenResult(wompiResponse);
    }

    async createPaymentSource(input: CreatePaymentSourceInput): Promise<PaymentSourceResult> {
        const wompiRequest = WompiMapper.toWompiPaymentSourceRequest(input);
        const wompiResponse = await this.wompiHttpClient.createPaymentSource(wompiRequest);
        return WompiMapper.toPaymentSourceResult(wompiResponse);
    }

    async createTransaction(input: CreateTransactionInput): Promise<TransactionResult> {
        const integritySecret = this.configService.get<string>('INTEGRITY_APY_KEY') || '';
        const signature = await WompiSignatureUtil.calculateSignature(
            input.reference,
            input.amount_in_cents,
            input.currency,
            integritySecret,
        );

        const wompiRequest = WompiMapper.toWompiTransactionRequest(input, signature);
        const wompiResponse = await this.wompiHttpClient.createTransaction(wompiRequest);
        return WompiMapper.toTransactionResult(wompiResponse);
    }
}

