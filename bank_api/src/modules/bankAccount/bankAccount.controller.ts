import { FastifyReply, FastifyRequest } from "fastify";
import { createBankAccount, getBankAccounts } from "./bankAccount.service";
import { CreateBankAccountInput } from "./bankAccount.schema";

export async function createBankAccountHandler(request: FastifyRequest<{
    Body: CreateBankAccountInput
}>) {

    const product = await createBankAccount({
        ...request.body,
        ownerId: request.user.id
    })

    return product
}

export async function getBankAccountsHandler() {
    const products = await getBankAccounts()

    return products
}