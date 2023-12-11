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
    id: z.number(), 
    status: z.boolean(),
    userId: z.number(),
    cartItems: z.array(cartItemSchema),
})

const addQuantityProductBodySchema = z.object ({
    quantity: number(),
})

const addProductToCartParamsSchema = z.object ({
    cartId: number(),
    productId: number(),
})

const removeAllProductsFromCartParamsSchema = z.object({
    cartId: z.number(),
})

const validateCartParamsSchema = z.object({
    cartId: z.number(),
})

const validateCartBodySchema = z.object({
    products: z.array(z.object({
      productId: z.number(),
      quantity: z.number().min(1),
    })),
  });

const createCartSchema = z.object({
    ...cartInput,
})


const cartResponseSchema = z.object({
    ...cartInput,
})


//Permet de renvoyer un tableau en reponse
const cartsResponseSchema = z.array(cartResponseSchema)

//Signifie que CreateCartInput sera type TS == structure et regle dans createCartSchema

export type CreateCartInput = z.infer<typeof createCartSchema>

export const {schemas: cartSchemas, $ref} = buildJsonSchemas({
    getCartProductsSchema,
    validateCartBodySchema,
    addQuantityProductBodySchema,
    addProductToCartParamsSchema,
    createCartSchema,
    cartResponseSchema,
    cartsResponseSchema,
    postCartBodySchema,
    getCartSchema,
    removeAllProductsFromCartParamsSchema,
    validateCartParamsSchema,
}, { $id: 'CartSchema'})