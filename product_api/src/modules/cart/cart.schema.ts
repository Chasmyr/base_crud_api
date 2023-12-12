import {number, z} from 'zod'
import {buildJsonSchemas} from 'fastify-zod'
import { cartItemSchema } from '../cartItems/cartItems.schema';


// OK
const cartInput = {
    userId: z.number(),
    status: z.boolean().optional()
}

// Ok post Cart
const postCartBodySchema = z.object({
    ...cartInput
})

// Ok post Cart
const getCartSchema = z.object({
    ...cartInput,
    cartId: z.number(),
})

// Recuperer info d'un panier
const getCartProductsSchema = z.object({
    ...cartInput,
    id: z.number(), 
    cartItems: z.array(cartItemSchema),
})

const cartIdSchema = z.object({
    cartId: z.number(),
})

const userIdSchema = z.object({
    userId: z.number(),
})


const validateCartBodySchema = z.object({
    products: z.array(z.object({
      productId: z.number(),
      quantity: z.number().min(1),
    })),
});

const processCartBodySchema = z.object({
    status: z.boolean(),
})

const cartResponseSchema = z.object({
    ...cartInput,
})

const cartsResponseSchema = z.array(cartResponseSchema)

export const {schemas: cartSchemas, $ref} = buildJsonSchemas({
    getCartProductsSchema,
    processCartBodySchema,
    validateCartBodySchema,
    cartResponseSchema,
    cartsResponseSchema,
    postCartBodySchema,
    getCartSchema,
    userIdSchema,
    cartIdSchema
}, { $id: 'CartSchema'})