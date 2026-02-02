import { IsString, IsNotEmpty, IsNumber, IsPositive, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProductDto {
    @ApiProperty({ description: 'The name of the product' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ description: 'The price of the product', example: 100 })
    @IsNumber()
    @IsPositive()
    price: number;

    @ApiProperty({ description: 'The currency of the product', example: 'USD' })
    @IsString()
    @IsNotEmpty()
    currency: string;

    @ApiProperty({ description: 'The description of the product' })
    @IsString()
    @IsNotEmpty()
    description: string;
}

export class UpdateProductDto {
    @ApiPropertyOptional({ description: 'The name of the product' })
    @IsString()
    @IsOptional()
    name?: string;

    @ApiPropertyOptional({ description: 'The price of the product', example: 100 })
    @IsNumber()
    @IsPositive()
    @IsOptional()
    price?: number;

    @ApiPropertyOptional({ description: 'The currency of the product', example: 'USD' })
    @IsString()
    @IsOptional()
    currency?: string;

    @ApiPropertyOptional({ description: 'The description of the product' })
    @IsString()
    @IsOptional()
    description?: string;
}
