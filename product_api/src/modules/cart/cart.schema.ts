import {z} from 'zod'
import {buildJsonSchemas} from 'fastify-zod'
 

const cartInput = {
    userId: z.number(),
    status: z.boolean().optional()
}

const cartGenerated = {
    id: z.number(),
    createdAt: z.string(),
    updatedAt: z.string()
}

const createCartSchema = z.object({
    ...cartInput,
})

const cartResponseSchema = z.object({
    ...cartInput,
    ...cartGenerated,
})

const removeProductFromCartSchema = z.object({
    ...cartInput,
})

const cartsResponseSchema = z.array(cartResponseSchema)

export type CreateCartInput = z.infer<typeof createCartSchema>

export const {schemas: cartSchemas, $ref} = buildJsonSchemas({
    cartInput,
    cartGenerated,
    createCartSchema,
    cartResponseSchema,
    cartsResponseSchema,
}, { $id: 'CartSchema'})