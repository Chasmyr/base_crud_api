import {z} from 'zod'
import {buildJsonSchemas} from 'fastify-zod'

const createTransactionSchemaInput = z.object({
    payeeName: z.string({
        required_error: 'Payee name is required'
    }),
    payeeId: z.string({
        required_error: 'Payee id is required'
    }),
    amount: z.number({
        required_error: 'Amount is required'
    })
})

const createTransactionResponseSchema = z.object({
    id: z.number(),
    amount: z.number(),
    payeeName: z.string()
})

const createTransactionSchema = z.object({
    payeeName: z.string(),
    payeeId: z.string(),
    amount: z.number(),
    creditCardId: z.number()
})

const transactionsResponseSchema = z.array(createTransactionResponseSchema)

export type CreateTransactionInput = z.infer<typeof createTransactionSchemaInput>

export const {schemas: transactionSchemas, $ref} = buildJsonSchemas({
    createTransactionSchemaInput,
    createTransactionResponseSchema,
    transactionsResponseSchema,
    createTransactionSchema
}, { $id: 'TransactionSchemas'})