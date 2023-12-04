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
    creditCardNumber: z.string(), 
    expiration: z.string(),
    cvv: z.number()
})

const creditCardAuthResponseSchema = z.object({
    id: z.number(),
    isActive: z.boolean(),
    token: z.string()
})


const creditCardsResponseSchema = z.array(createCreditCardResponseSchema)

export type CreateCreditCardInput = z.infer<typeof createCreditCardSchema>

export const {schemas: creditCardSchemas, $ref} = buildJsonSchemas({
    createCreditCardSchema,
    createCreditCardResponseSchema,
    creditCardAuthResponseSchema,
    creditCardsResponseSchema
}, { $id: 'CreditCardSchemas'})