import {z} from 'zod'
import {buildJsonSchemas} from 'fastify-zod'

const createTransactionSchema = z.object({
    payeeName: z.string({
        required_error: 'Payee name is required'
    }),
    payeeId: z.string({
        required_error: 'Payee id is required'
    }),
    amount: z.number({
        required_error: 'Amount is required'
    }),
    creditCardId: z.number({
        required_error: 'Credit card id is required'
    })
})

const createTransactionResponseSchema = z.object({
    id: z.number(),
    amount: z.number(),
    payeeName: z.string()
})

const transactionsResponseSchema = z.array(createTransactionResponseSchema)

export type CreateTransactionInput = z.infer<typeof createTransactionSchema>

export const {schemas: transactionSchemas, $ref} = buildJsonSchemas({
    createTransactionSchema,
    createTransactionResponseSchema,
    transactionsResponseSchema,
}, { $id: 'TransactionSchemas'})