import {z} from 'zod'
import {buildJsonSchemas} from 'fastify-zod'

const createCreditCardSchema = z.object({
    expiration: z.string({
        required_error: 'Expiration date is required',
    }),
    accountId: z.number({
        required_error: 'Account id is required',
    })
})

const createCreditCardResponseSchema = z.object({
    id: z.number(),
    creditCardNumer: z.string(), 
    expiration: z.string(),
    cvv: z.number()
})

const creditCardAuthSchema = z.object({
    id: z.number({
        required_error: 'Credit card id is required',
    })
})

const creditCardAuthResponseSchema = z.object({
    id: z.number(),
    isActive: z.boolean(),
    token: z.string()
})

const creditCardsResponseSchema = z.array(createCreditCardResponseSchema)

export type CreateCreditCardInput = z.infer<typeof createCreditCardSchema>
export type AuthCreditCardInput = z.infer<typeof creditCardAuthSchema>

export const {schemas: creditCardSchemas, $ref} = buildJsonSchemas({
    createCreditCardSchema,
    createCreditCardResponseSchema,
    creditCardAuthSchema,
    creditCardAuthResponseSchema,
    creditCardsResponseSchema
}, { $id: 'CreditCardSchemas'})