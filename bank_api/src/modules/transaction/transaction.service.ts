import { Transaction } from "@prisma/client";
import prisma from "../../utils/prisma";
import { CreateAuthorizedTransaction } from "./transaction.schema";


export async function createTransaction(input: CreateAuthorizedTransaction){

    const {payeeName, payeeId, amount, creditCardId} = input

    const transaction = await prisma.transaction.create({
        data: {payeeName, payeeId, amount, creditCardId}
    })

    return transaction
}

export async function getTransactionsFromCreditCard(creditCardId: number) {
    const transactions = await prisma.transaction.findMany({
        where: {creditCardId: creditCardId}
    })

    return transactions
}

export async function getTransactionsFromBankAccount(bankAccountId: number) {
    const creditcards = await prisma.creditCard.findMany({
        where: {accountId: bankAccountId}
    })

    const transactions: Transaction[] = []
    creditcards.map(async (creditCard) => {
        let transaction = await prisma.transaction.findMany({
            where: {creditCardId: creditCard.id}
        })
        if(transaction.length > 0) {
            transaction.map((t) => {
                transactions.push(t)
            })
        }
    })

    return transactions
}

export async function getTransactionsFromUser(userId: number) {

    const bankAccounts = await prisma.bankAccount.findMany({
        where: {ownerId: userId}
    })

    const transactions: Transaction[] = []
    bankAccounts.map(async (bankAccount) => {
        let creditCards = await prisma.creditCard.findMany({
            where: {accountId: bankAccount.id}
        })
        creditCards.map( async (creditCard) => {
            let transaction = await prisma.transaction.findMany({
                where: {creditCardId: creditCard.id}
            })
            if(transaction.length > 0) {
                transaction.map((t) => {
                    transactions.push(t)
                })
            }
        })
    })

    return transactions
}

export async function isUserOwnerOfCard(creditCardId: number, userId: number) {
    const creditCard = await prisma.creditCard.findFirst({
        where: {id: creditCardId}
    })

    const bankAccount = await prisma.bankAccount.findFirst({
        where: {id: creditCard?.accountId}
    })

    const userOfBankAccount = await prisma.user.findFirst({
        where: {id: bankAccount?.ownerId}
    })

    if(userOfBankAccount?.id === userId) {
        return true
    } else {
        return false
    }
}

export async function isUserOwnerOfBankAccount(bankAccountId: number, userId: number) {

    const bankAccount = await prisma.bankAccount.findFirst({
        where: {id: bankAccountId}
    })

    const userOfBankAccount = await prisma.user.findFirst({
        where: {id: bankAccount?.ownerId}
    })

    if(userOfBankAccount?.id === userId) {
        return true
    } else {
        return false
    }
}