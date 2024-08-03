import { SQSEvent } from 'aws-lambda';
import { z, ZodError } from 'zod';

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

    } catch (error: unknown) {
        if (error instanceof ZodError) {
            console.log('Validation errors:', error.format());
        } else {
            console.log('Unknown error:', error);
        }
        return;
    }
};