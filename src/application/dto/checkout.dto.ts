import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class CheckoutDto {
    @IsUUID()
    @IsNotEmpty()
    productId: string;

    @IsString()
    @IsNotEmpty()
    creditCardToken: string;

    @IsString()
    @IsNotEmpty()
    currency: string;
}

export class CheckoutResponseDto {
    success: boolean;
    transactionId?: string;
    message?: string;
}
