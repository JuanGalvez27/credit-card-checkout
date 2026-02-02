import { IsString, IsNotEmpty, IsNumber, IsPositive, IsOptional, IsUUID, IsEmail, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTransactionDto {
    @ApiProperty({ description: 'Product ID' })
    @IsUUID()
    @IsNotEmpty()
    productId: string;

    @ApiProperty({ description: 'Transaction amount in cents' })
    @IsNumber()
    @IsPositive()
    amount: number;

    @ApiProperty({ description: 'Base fee' })
    @IsNumber()
    @IsPositive()
    baseFee: number;

    @ApiProperty({ description: 'Delivery fee' })
    @IsNumber()
    @IsPositive()
    deliveryFee: number;

    @ApiProperty({ description: 'Customer email' })
    @IsEmail()
    @IsNotEmpty()
    customerEmail: string;

    @ApiProperty({ description: 'Card number' })
    @IsString()
    @IsNotEmpty()
    cardNumber: string;

    @ApiProperty({ description: 'Card CVC' })
    @IsString()
    @IsNotEmpty()
    cardCvc: string;

    @ApiProperty({ description: 'Card expiration month (MM)' })
    @IsString()
    @IsNotEmpty()
    cardExpMonth: string;

    @ApiProperty({ description: 'Card expiration year (YY)' })
    @IsString()
    @IsNotEmpty()
    cardExpYear: string;

    @ApiProperty({ description: 'Card holder name' })
    @IsString()
    @IsNotEmpty()
    cardHolder: string;

    @ApiProperty({ description: 'Payment installments', default: 1 })
    @IsNumber()
    @Min(1)
    @Max(36)
    @IsOptional()
    installments?: number;

    @ApiPropertyOptional({ description: 'Customer ID' })
    @IsUUID()
    @IsOptional()
    customerId?: string;
}
