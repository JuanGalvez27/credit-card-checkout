import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('products')
export class ProductTypeORM {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column('decimal', { precision: 10, scale: 2 })
    price: number;

    @Column()
    currency: string;

    @Column()
    description: string;

    @Column('int', { default: 0 })
    stock: number;
}
