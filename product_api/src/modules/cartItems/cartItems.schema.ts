import {z} from 'zod'
import {buildJsonSchemas} from 'fastify-zod'
import { getAllProductsSchema } from '../product/product.schema';

export const cartItemSchema = z.object({
    id: z.number(),
    productId: z.number(),
    quantity: z.number(),
    product: getAllProductsSchema,
});

export const {schemas: cartItemsSchemas, $ref} = buildJsonSchemas({
    cartItemSchema,
}, { $id: 'CartItemsSchema'})