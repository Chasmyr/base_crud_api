import { FastifyReply, FastifyRequest } from "fastify";
import { createBankAccount, deleteBankAccount, getBankAccount, getBankAccounts, updateBankAccount } from "./bankAccount.service";
import { BankAccountUpdateSchema, CreateBankAccountInput } from "./bankAccount.schema";
import { created, notFound, serverError, unauthorized } from "../../utils/const";
import { getUser } from "../user/user.service";

export async function createBankAccountHandler(request: FastifyRequest<{
    Body: CreateBankAccountInput,
    Params: {id: string}
}>, reply: FastifyReply) {

    try {
        if(request.user) {
            const {role: roleFromToken} = request.user
            const userClientId = Number(request.params.id)
            
            const userExist = getUser(userClientId)

            if(!userExist) {
                return reply.send(notFound).send({error: 'User not found'})
            }

            if(roleFromToken === 'admin' || roleFromToken === 'employee') {
                const bankAccount = await createBankAccount({
                    ...request.body,
                    ownerId: userClientId
                })
            
                return reply.code(created).send(bankAccount)
            } else {
                return reply.code(unauthorized).send({error: 'Permission denied'})
            }
        } else {
            return reply.code(serverError).send({error: 'Server error'})
        }
    } catch(e) {
        return reply.code(serverError).send(e)
    }
}

// delete bank account
export async function deleteHandler(request:FastifyRequest<{
    Params: {id: string}
}>, reply: FastifyReply) {

   try {
       if(request.user) {
            // TODO - ajouter la desactivation des cartes relatives a ce bank account
            const {id: idFromToken, role: roleFromToken} = request.user
            const bankAccountId = Number(request.params.id)
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
        } else {
           reply.code(serverError).send({error: 'Server error'})
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

    try {
        if(request.user) {
            const {id: idFromToken, role: roleFromToken} = request.user
            const bankAccountId = Number(request.params.id)
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
        } else {
            reply.code(serverError).send({error: 'Server error'})
        }
    } catch(e) {
        return reply.code(serverError).send(e)
    } 
}  

export async function getBankAccountsHandler() {
    // TODO - ajouter verif JWT et get un bank account par id
    const products = await getBankAccounts()

    return products
}