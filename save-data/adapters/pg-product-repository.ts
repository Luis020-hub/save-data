import type { ProductRepository } from '../bondaries/product-repository';
import type { Product } from '../entities/product';
import type { Connection } from './pg-connection';

export class PgProductRepository implements ProductRepository {
    public constructor(readonly connection: Connection) { }

    async existsByCode(code: string): Promise<boolean> {
        const result = await this.connection.query('SELECT code FROM products WHERE code = $1', [code]);
        if (result.length === 0) {
            return false;
        }
        return true;
    }

    async save(product: Product): Promise<void> {
        await this.connection.query('INSERT INTO products(code, name) VALUES($1, $2)',
            [
                product.getCode(),
                product.getName(),
            ]);
        return;
    }
}