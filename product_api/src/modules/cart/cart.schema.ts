import {z} from 'zod'
import {buildJsonSchemas} from 'fastify-zod'

const cartInput = {
    title: z.string(),
    price: z.number(),
    content: z.string().optional()
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

const cartsResponseSchema = z.array(cartResponseSchema)

export type CreateCartInput = z.infer<typeof createCartSchema>

export const {schemas: cartSchemas, $ref} = buildJsonSchemas({
    createCartSchema,
    cartResponseSchema,
    cartsResponseSchema
}, { $id: 'CartSchema'})