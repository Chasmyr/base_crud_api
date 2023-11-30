import prisma from "../../utils/prisma";
import { CreateTransactionInput } from "./transaction.schema";


export async function createTransaction(input: CreateTransactionInput){

    const {payeeName, payeeId, amount, creditCardId} = input

    const transaction = await prisma.transaction.create({
        data: {payeeName, payeeId, amount, creditCardId}
    })

    return transaction

}


export async function getTransactions() {
    return prisma.transaction.findMany({
        select: {
            payeeName: true,
            amount: true,
            createdAt: true,
            creditCard: {
                select: {
                    creditCardNumber: true,
                    accountLinked: {
                        select: {
                            id: true,
                            owner: {
                                select: {
                                    firstName: true,
                                    lastName: true,
                                    id: true
                                }
                            }
                        }
                    }
                }
            }
        }
    })
}