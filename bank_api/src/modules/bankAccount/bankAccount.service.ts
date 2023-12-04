import prisma from "../../utils/prisma";
import { BankAccountUpdateSchema, CreateBankAccountInput } from "./bankAccount.schema";

export async function createBankAccount(data: CreateBankAccountInput & {ownerId: number}) {
    return prisma.bankAccount.create({
        data
    })
}

// delete bank account, il faudra supprimer les cartes bancaires mais pas les transactions
export async function deleteBankAccount(id: number) {
    
    const bankAccount = await prisma.bankAccount.delete({
        where: { id: id }
    })

    const message = {message: `Bank account with id ${bankAccount.id} has been deleted`}

    return message
}

export async function updateBankAccount(id: number, body: BankAccountUpdateSchema) {

    const updatedBankAccount = await prisma.bankAccount.update({
        where: {id: id},
        data: body
    })

    return updatedBankAccount
}

// get one bank account
export async function getBankAccount(id: number) {

    const bankAccount = await prisma.bankAccount.findUnique({
        where: {id: id}
    })

    return bankAccount
}

export async function getBankAccounts() {
    return prisma.bankAccount.findMany({
        select: {
            balance: true,
            overdraft: true,
            id: true,
            owner: {
                select: {
                    firstName: true,
                    lastName: true,
                    id: true
                }
            }
        }
    })
}