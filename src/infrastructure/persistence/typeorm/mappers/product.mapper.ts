import { Product } from '../../../../../domain/entities/product';
import { ProductTypeORM } from '../entities/product.typeorm';

export class ProductMapper {
    static toDomain(entity: ProductTypeORM): Product {
        return new Product(
            entity.id,
            entity.name,
            Number(entity.price), // Postgres returns decimal as string
            entity.currency,
            entity.description,
        );
    }

    static toPersistence(domain: Product): ProductTypeORM {
        const entity = new ProductTypeORM();
        entity.id = domain.id;
        entity.name = domain.name;
        entity.price = domain.price;
        entity.currency = domain.currency;
        entity.description = domain.description;
        return entity;
    }
}
