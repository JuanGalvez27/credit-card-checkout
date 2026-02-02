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

    async save(product: Product): Promise<Product> {
        const entity = ProductMapper.toPersistence(product);
        const savedEntity = await this.repository.save(entity);
        return ProductMapper.toDomain(savedEntity);
    }

    async update(id: string, product: Partial<Product>): Promise<Product | null> {
        const existing = await this.repository.findOne({ where: { id } });
        if (!existing) return null;

        await this.repository.update(id, {
            name: product.name,
            price: product.price,
            currency: product.currency,
            description: product.description
        });

        const updated = await this.repository.findOne({ where: { id } });
        if (!updated) return null;
        return ProductMapper.toDomain(updated);
    }

    async delete(id: string): Promise<boolean> {
        const result = await this.repository.delete(id);
        return (result.affected ?? 0) > 0;
    }
}
