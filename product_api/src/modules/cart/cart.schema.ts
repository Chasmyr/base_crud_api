import {z} from 'zod'
import {buildJsonSchemas} from 'fastify-zod'
 

const cartInput = {
    userId: z.number(),
    status: z.boolean().optional()
}

const getCartsSchema = z.object({
    userId: z.number()
})

const getCartProductSchema = z.object({
    cartId: z.number(),
    productId: z.number()
})

const createCartSchema = z.object({
    ...cartInput,
})


const cartResponseSchema = z.object({
    ...cartInput,
})

const removeProductFromCartSchema = z.object({
    ...cartInput,
})

//Permet de renvoyer un tableau en reponse
const cartsResponseSchema = z.array(cartResponseSchema)

//Signifie que CreateCartInput sera type TS == structure et regle dans createCartSchema

export type CreateCartInput = z.infer<typeof createCartSchema>

export const {schemas: cartSchemas, $ref} = buildJsonSchemas({
    cartInput,
    getCartProductSchema,
    createCartSchema,
    cartResponseSchema,
    cartsResponseSchema,
    getCartsSchema,
}, { $id: 'CartSchema'})