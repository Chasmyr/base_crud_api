import { FastifyRequest } from "fastify";
import { CreateTransactionInput } from "./transaction.schema";
import { createTransaction, getTransactions } from "./transaction.service";

export async function createTransactionHandler(request: FastifyRequest<{
    Body: CreateTransactionInput
}>) {
    const transaction = await createTransaction({
        ...request.body
    })

    return transaction
}

export async function getTransactionsHandler() {
    const transactions = await getTransactions()

    return transactions
}