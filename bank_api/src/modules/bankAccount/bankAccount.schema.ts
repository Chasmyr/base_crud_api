import {z} from 'zod'
import {buildJsonSchemas} from 'fastify-zod'

const bankAccountInput = {
    balance: z.number({
        required_error: 'Balance number is required',
    }),
    overdraft: z.number({
        required_error: 'Overdraft number is required',
    })
}

const createBankAccountSchema = z.object({
    ...bankAccountInput,
})

const bankAccountResponseSchema = z.object({
    ...bankAccountInput,
    id: z.number()
})

const bankAccountsSchema = z.array(bankAccountResponseSchema)

export type CreateBankAccountInput = z.infer<typeof createBankAccountSchema>

export const {schemas: bankAccountSchemas, $ref} = buildJsonSchemas({
    createBankAccountSchema,
    bankAccountResponseSchema,
    bankAccountsSchema
}, { $id: 'BankAccountSchema'})