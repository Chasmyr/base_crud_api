import prisma from "../../utils/prisma";
import { CreateTransaction } from "./transaction.schema";


export async function createTransaction(input: CreateTransaction){

    const {payeeName, payeeId, amount, creditCardId} = input

    const transaction = await prisma.transaction.create({
        data: {payeeName, payeeId, amount, creditCardId}
    })

    return transaction
}

export async function getTransactions() {
    return prisma.transaction.findMany({
        select: {
            id: true,
            payeeName: true,
            amount: true,
            createdAt: true,
        }
    })
}