import { ProductMapper } from './product.mapper';
import { ProductTypeORM } from '../entities/product.typeorm';
import { Product } from '../../../../../domain/entities/product';

describe('ProductMapper', () => {
    it('should map from entity to domain', () => {
        const entity = new ProductTypeORM();
        entity.id = '1';
        entity.name = 'Test';
        entity.price = 100;
        entity.currency = 'USD';
        entity.description = 'Desc';

        const domain = ProductMapper.toDomain(entity);

        expect(domain).toBeInstanceOf(Product);
        expect(domain.id).toBe('1');
        expect(domain.price).toBe(100);
    });

    it('should map from domain to persistence', () => {
        const domain = new Product('1', 'Test', 100, 'USD', 'Desc');
        const entity = ProductMapper.toPersistence(domain);

        expect(entity).toBeInstanceOf(ProductTypeORM);
        expect(entity.id).toBe('1');
        expect(entity.price).toBe(100);
    });
});
