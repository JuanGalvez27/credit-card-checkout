import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductTypeORM } from './infrastructure/persistence/typeorm/entities/product.typeorm';

@Injectable()
export class SeedingService implements OnApplicationBootstrap {
    constructor(
        @InjectRepository(ProductTypeORM)
        private readonly productRepo: Repository<ProductTypeORM>,
    ) { }

    async onApplicationBootstrap() {
        const count = await this.productRepo.count();
        if (count === 0) {
            console.log('Seeding products...');
            const products = [
                {
                    name: 'Premium Subscription',
                    price: 99.99,
                    currency: 'USD',
                    description: 'Annual premium subscription',
                },
                {
                    name: 'Basic Subscription',
                    price: 9.99,
                    currency: 'USD',
                    description: 'Monthly basic subscription',
                },
                {
                    name: 'Enterprise License',
                    price: 499.00,
                    currency: 'USD',
                    description: 'Lifetime enterprise license',
                },
            ];
            await this.productRepo.save(products);
            console.log('Products seeded!');
        }
    }
}
