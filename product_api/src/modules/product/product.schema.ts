import {z} from 'zod'
import {buildJsonSchemas} from 'fastify-zod'

const productInput = {
    title: z.string(),
    price: z.number(),
    content: z.string().optional()
}

const productOutput = {
    id: z.number(),
    title: z.string(),
    price: z.number(),
    content: z.string().optional()
}

export const getAllProductsSchema = z.object({
    ...productOutput,
})

const createProductSchema = z.object({
    ...productInput,
})


const productResponseSchema = z.object({
    ...productInput,
})

const productsResponseSchema = z.array(productResponseSchema)

export type CreateProductInput = z.infer<typeof createProductSchema>

export const {schemas: productSchemas, $ref} = buildJsonSchemas({
    getAllProductsSchema,
    createProductSchema,
    productResponseSchema,
    productsResponseSchema
}, { $id: 'ProductSchema'})