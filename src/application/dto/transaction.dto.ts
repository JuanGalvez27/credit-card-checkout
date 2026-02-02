import { IsString, IsNotEmpty, IsNumber, IsPositive, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTransactionDto {
    @ApiProperty({ description: 'Product ID' })
    @IsUUID()
    @IsNotEmpty()
    productId: string;

    @ApiProperty({ description: 'Transaction amount' })
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

    @ApiPropertyOptional({ description: 'Customer ID' })
    @IsUUID()
    customerId?: string;

    @ApiPropertyOptional({ description: 'Wompi Transaction ID' })
    @IsString()
    @IsOptional()
    wompiTransactionId?: string;

    @ApiPropertyOptional({ description: 'Wompi Reference' })
    @IsString()
    @IsOptional()
    wompiReference?: string;
}
