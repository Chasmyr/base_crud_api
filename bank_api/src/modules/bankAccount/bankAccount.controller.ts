import { FastifyReply, FastifyRequest } from "fastify";
import { createBankAccount, deleteBankAccount, getBankAccount, getBankAccounts, updateBankAccount } from "./bankAccount.service";
import { BankAccountUpdateSchema, CreateBankAccountInput } from "./bankAccount.schema";
import { created, notFound, serverError, unauthorized } from "../../utils/const";

export async function createBankAccountHandler(request: FastifyRequest<{
    Body: CreateBankAccountInput
}>, reply: FastifyReply) {
    try {
        const bankAccount = await createBankAccount({
            ...request.body,
            ownerId: request.user.id
        })
    
        return reply.code(created).send(bankAccount)
    } catch(e) {
        return reply.code(serverError).send(e)
    }
}

// delete bank account
export async function deleteHandler(request:FastifyRequest<{
    Params: {id: string}
}>, reply: FastifyReply) {

    const {id: idFromToken, role: roleFromToken} = request.user
    const bankAccountId = Number(request.params.id)
    
    try {
        
        const bankAccount = await getBankAccount(bankAccountId)
        
        if(!bankAccount) {
            return reply.status(notFound).send({error: 'Bank account not found'})
        } 
            
        if(idFromToken === bankAccount?.ownerId || roleFromToken === 'admin' || roleFromToken === 'employee') {
                
            const message = await deleteBankAccount(bankAccountId)

            return reply.send(message)
        } else {
            return reply.code(unauthorized).send({error: 'Permission denied'})
        }
    } catch(e) {
        return reply.code(serverError).send(e)
    }
}

// update bankaccount
export async function updateHandler(request: FastifyRequest<{
    Params: {id: string},
    Body: BankAccountUpdateSchema
}>, reply: FastifyReply) {

    const {id: idFromToken, role: roleFromToken} = request.user
    const bankAccountId = Number(request.params.id)

    try {

        const bankAccount = await getBankAccount(bankAccountId)

        if(!bankAccount) {
            return reply.status(notFound).send({error: 'Bank account not found'})
        }
        
        if(idFromToken === bankAccount?.ownerId || roleFromToken === 'admin' || roleFromToken === 'employee') {
            
            const updatedBankAccount = await updateBankAccount(bankAccountId, request.body)
        
            return reply.send(updatedBankAccount)
        } else {
            return reply.code(unauthorized).send({error: 'Permission denied'})
        }
    } catch(e) {
        return reply.code(serverError).send(e)
    }    
}

export async function getBankAccountsHandler() {
    const products = await getBankAccounts()

    return products
}