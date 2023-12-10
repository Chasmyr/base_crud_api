import { FastifyRequest, FastifyReply } from "fastify";
import { CreateTransactionInput } from "./transaction.schema";
import { createTransaction, getTransactions } from "./transaction.service";
import { creditCardDesactivation, getCreditCard, isCreditCardCredentialsOk } from "../creditCard/creditCard.service";
import { serverError, notFound, unauthorized, permDenied } from "../../utils/const";
import { CreditCardJwtSchema } from "../creditCard/creditCard.schema";
import { compareDateForCreditCard } from "../../utils/date";

export async function createTransactionHandler(request: FastifyRequest<{
    Body: CreateTransactionInput
}>, reply: FastifyReply) {

    // récup les données
    try {
        if(request.creditCard) {
            const creditCardToken = request.creditCard.creditCard
    
            if(creditCardToken) {
                const {
                    id: creditCardIdFromToken, 
                    creditCardNumber: creditCardNumberFromToken,
                    expiration: expirationFromToken,
                    cvv: cvvFromToken
                } = creditCardToken
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
            
                        return reply.send(transaction)
                    } else {
                        const desactiveCard = creditCardDesactivation(creditCardIdFromToken)
                        return reply.code(serverError).send("Credit card is expired")
                    }
                } else {
                    return reply.code(unauthorized).send(permDenied)
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

export async function getAllTransactionsFormCreditCard() {
    
}

export async function getAllTransactionsFromBankAccount() {
    
}

export async function getAllTransactionsFromUser() {
    
}

export async function getTransactionsHandler() {
    const transactions = await getTransactions()

    return transactions
}