import { FastifyReply, FastifyRequest } from "fastify";
import { createBankAccount, getBankAccounts } from "./bankAccount.service";
import { CreateBankAccountInput } from "./bankAccount.schema";
import prisma from "../../utils/prisma";

export async function createBankAccountHandler(request: FastifyRequest<{
    Body: CreateBankAccountInput
}>, reply: FastifyReply) {
    try {
        const bankAccount = await createBankAccount({
            ...request.body,
            ownerId: request.user.id
        })
    
        return reply.code(201).send(bankAccount)
    } catch(e) {
        return reply.code(500).send(e)
    }
}

// delete bank account
export async function deleteHandler(request:FastifyRequest, reply: FastifyReply) {

    const {id: idFromToken, role: roleFromToken} = request.user
    const bankAccountId = Number(request.params.id)
    
    try {

        const bankAccount = await prisma.bankAccount.findUnique({
            where: {id: bankAccountId}
        })
        
        if(idFromToken === bankAccount?.ownerId || roleFromToken === 'admin' || roleFromToken === 'employee') {
            
        } else {
            return reply.code(401).send({error: 'Permission denied'})
        }
    } catch(e) {
        return reply.code(500).send(e)
    }
}

// update bankaccount

export async function getBankAccountsHandler() {
    const products = await getBankAccounts()

    return products
}