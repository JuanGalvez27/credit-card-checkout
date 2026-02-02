import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductRepositoryPort } from '../../../../application/ports/out/product-repository.port';
import { Product } from '../../../../domain/models/product';
import { ProductTypeORM } from '../entities/product.typeorm';
import { ProductMapper } from '../mappers/product.mapper';

@Injectable()
export class TypeOrmProductRepository implements ProductRepositoryPort {
    constructor(
        @InjectRepository(ProductTypeORM)
        private readonly repository: Repository<ProductTypeORM>,
    ) { }

    async findAll(): Promise<Product[]> {
        const entities = await this.repository.find();
        return entities.map(ProductMapper.toDomain);
    }

    async findById(id: string): Promise<Product | null> {
        const entity = await this.repository.findOne({ where: { id } });
        if (!entity) return null;
        return ProductMapper.toDomain(entity);
    }
}
