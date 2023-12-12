import { FastifyRequest, FastifyReply } from "fastify";
import { CreateTransactionInput } from "./transaction.schema";
import { createTransaction, getTransactions, getTransactionsFromBankAccount, getTransactionsFromCreditCard, getTransactionsFromUser, isUserOwnerOfBankAccount, isUserOwnerOfCard } from "./transaction.service";
import { creditCardDesactivation, getCreditCard, isCreditCardCredentialsOk } from "../creditCard/creditCard.service";
import { serverError, notFound, unauthorized, permDenied, created } from "../../utils/const";
import { CreditCardJwtSchema } from "../creditCard/creditCard.schema";
import { compareDateForCreditCard } from "../../utils/date";
import { getBankAccount } from "../bankAccount/bankAccount.service";
import { getUser } from "../user/user.service";

export async function createTransactionHandler(request: FastifyRequest<{
    Body: CreateTransactionInput
}>, reply: FastifyReply) {

    // récup les données
    try {
        if(request.user) {
            const {
                id: creditCardIdFromToken, 
                creditCardNumber: creditCardNumberFromToken,
                expiration: expirationFromToken,
                cvv: cvvFromToken
            } = request.user
            const {payeeName, payeeId, amount} = request.body
    
            const creditCard = await getCreditCard(creditCardIdFromToken)
            
            // vérifier le contenu 
            if(!creditCard) {
                return reply.status(notFound).send({error: 'Credit card not found'})
            }
    
            const isCreditCardValid = await isCreditCardCredentialsOk(creditCardIdFromToken, creditCardNumberFromToken, expirationFromToken, cvvFromToken)
    
            if(isCreditCardValid) {
                const currentDate = new Date()
                const isDateValid = compareDateForCreditCard(currentDate, expirationFromToken)
                if(isDateValid) {
                    const transactionInfo = {
                        payeeName,
                        payeeId,
                        amount,
                        creditCardId: creditCardIdFromToken
                    }
                    const transaction = await createTransaction(transactionInfo)
            
                    return reply.code(created).send(transaction)
                } else {
                    const desactiveCard = creditCardDesactivation(creditCardIdFromToken)
                    return reply.code(serverError).send("Credit card is expired")
                }
            } else {
                return reply.code(unauthorized).send(permDenied)
            }
        } else {
            return reply.code(serverError).send({error: 'Server error'})
        }
    } catch (e) {
        return reply.code(serverError).send(e)
    }
}

export async function getAllTransactionsFormCreditCard(request: FastifyRequest<{
    Params: {id: string}
}>, reply: FastifyReply) {
    try {
        if(request.user) {

            const creditCardId = Number(request.params.id)
    
            const creditCard = await getCreditCard(creditCardId)
            
            // vérifier le contenu 
            if(!creditCard) {
                return reply.status(notFound).send({error: 'Credit card not found'})
            }

            const isUserOwner = await isUserOwnerOfCard(creditCardId, request.user.id)
            
            if(isUserOwner || request.user.role === 'employee' || request.user.role === 'admin') {
                const transactions = await getTransactionsFromCreditCard(creditCardId)
                return reply.send(transactions)
            } else {
                return reply.code(unauthorized).send(permDenied)
            }
        } else {
            return reply.code(serverError).send({error: 'Server error'})
        }
    } catch (e) {
        return reply.code(serverError).send(e)
    }
}

export async function getAllTransactionsFromBankAccount(request: FastifyRequest<{
    Params: {id: string}
}>, reply: FastifyReply) {
    try {
        if(request.user) {

            const bankAccountId = Number(request.params.id)
    
            const bankAccount = await getBankAccount(bankAccountId)
            
            // vérifier le contenu 
            if(!bankAccount) {
                return reply.status(notFound).send({error: 'Bank account not found'})
            }

            const isUserOwner = await isUserOwnerOfBankAccount(bankAccountId, request.user.id)
            
            if(isUserOwner || request.user.role === 'employee' || request.user.role === 'admin') {
                const transactions = await getTransactionsFromBankAccount(bankAccountId)
                return reply.send(transactions)
            } else {
                return reply.code(unauthorized).send(permDenied)
            }
        } else {
            return reply.code(serverError).send({error: 'Server error'})
        }
    } catch (e) {
        return reply.code(serverError).send(e)
    }
}

export async function getAllTransactionsFromUser(request: FastifyRequest<{
    Params: {id: string}
}>, reply: FastifyReply) {
    try {
        if(request.user) {
            const user = getUser(request.user.id)
            if(!user) {
                return reply.status(notFound).send({error: 'User not found'})
            }
            const transactions = await getTransactionsFromUser(request.user.id)
            return reply.send(transactions)
        } else {
            return reply.code(serverError).send({error: 'Server error'})
        }
    } catch (e) {
        return reply.code(serverError).send(e)
    }
}