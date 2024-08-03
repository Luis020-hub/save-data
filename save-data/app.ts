import { SQSEvent } from 'aws-lambda';
import { z, ZodError } from 'zod';
import { SupermarketRepository } from './bondaries/supermarket-repository';
import { PgSupermarketRepository } from './adapters/pg-supermarket-repository';
import { CreateSupermarket } from './use-cases/create-supermarket';
import { Connection, PgConnection } from './adapters/pg-connection';
import { CreateProduct } from './use-cases/create-products';
import { ProductRepository } from './bondaries/product-repository';
import { PgProductRepository } from './adapters/pg-product-repository';

export async function lambdaHandler(event: SQSEvent): Promise<void> {
    const recordsSchema = z.array(z.object({
        nfeId: z.string(),
        supermarketName: z.string(),
        cnpj: z.string(),
        address: z.string(),
        date: z.coerce.date(),
        items: z.array(z.object({
            name: z.string(),
            code: z.string(),
            price: z.coerce.number(),
        }))
    }));

    try {
        const records = recordsSchema.parse(event.Records.map((record) => {
            const body = JSON.parse(record.body);

            return {
                nfeId: body.nfeId,
                supermarketName: body.supermarketName,
                cnpj: body.cnpj,
                address: body.address,
                date: body.date,
                items: body.items.map((item: any) => ({
                    name: item.name,
                    code: item.code,
                    price: item.price,
                })),
            };
        }));

        console.log(records);

        const connection: Connection = new PgConnection("postgres://admin:admin@localhost:5432/my_db");
        const SupermarketRepository: SupermarketRepository = new PgSupermarketRepository(connection);
        const productRepository: ProductRepository = new PgProductRepository(connection);
        const createSupermarket = new CreateSupermarket(SupermarketRepository);
        const createProduct = new CreateProduct(productRepository);

        for (let record of records) {
            await createSupermarket.execute({ cnpj: record.cnpj, name: record.supermarketName, address: record.address });
            for (let item of record.items) {
                await createProduct.execute({ code: item.code, name: item.name });
            }
        }

    } catch (error: unknown) {
        if (error instanceof ZodError) {
            console.log('Validation errors:', error.format());
        } else {
            console.log('Unknown error:', error);
        }
        return;
    }
};