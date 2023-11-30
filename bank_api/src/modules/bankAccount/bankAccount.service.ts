import prisma from "../../utils/prisma";
import { CreateBankAccountInput } from "./bankAccount.schema";

export async function createBankAccount(input: CreateBankAccountInput & {ownerId: number}) {
    return prisma.bankAccount.create({
        input,
    })
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