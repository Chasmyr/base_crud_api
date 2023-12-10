import { FastifyReply, FastifyRequest } from "fastify";
import { CreateCreditCardInput } from "./creditCard.schema";
import { createCreditCard, creditCardActivation, creditCardDesactivation, deleteCreditCard, getBankAccountFromCreditCard, getCreditCard, getCreditCards, updateCreditCard } from "./creditCard.service";
import { notFound, permDenied, serverError, unauthorized } from "../../utils/const";

export async function createCreditCardHandler(request: FastifyRequest<{
    Body: CreateCreditCardInput
}>) {
    const creditCard = await createCreditCard({
        ...request.body
    })

    return creditCard
}

// delete credit card
export async function deleteHanlder(request: FastifyRequest<{
    Params: {id: string}
}>, reply: FastifyReply) {

    try {
        if (request.user) {
            const {id: idFromToken, role: roleFromToken} = request.user
            const creditCardId = Number(request.params.id)
            const creditCard = await getCreditCard(creditCardId)
            
            if(!creditCard) {
                return reply.status(notFound).send({error: 'Credit card not found'})
            } 
    
            const cardAccount = await getBankAccountFromCreditCard(creditCard.accountId)
                
            if(idFromToken === cardAccount?.ownerId || roleFromToken === 'admin' || roleFromToken === 'employee') {
                
                const message = await deleteCreditCard(creditCardId)
    
                return reply.send(message)
            } else {
                return reply.code(unauthorized).send(permDenied)
            }
        } else {
            return reply.code(serverError).send({error: 'Server error'})
        }
    } catch(e) {
        return reply.code(serverError).send(e)
    }
}

export async function creditCardActivationHandler(request: FastifyRequest<{
    Params: {id: string}
}>, reply: FastifyReply) {

    try {
        if(request.user) {
            const {role: roleFromToken} = request.user
            const creditCardId = Number(request.params.id)
            const creditCard = await getCreditCard(creditCardId)
    
            if(!creditCard) {
                return reply.status(notFound).send({error: 'Credit card not found'})
            }
    
            if(roleFromToken === 'employee' || roleFromToken === 'admin') {
    
                const creditCardActivated = await creditCardActivation(request, creditCardId)
    
                return reply.send(creditCardActivated)
            } else {
                return reply.code(unauthorized).send(permDenied)
            }
        } else {
            return reply.code(serverError).send({error: 'Server error'})
        }
    } catch(e) {
        return reply.code(serverError).send(e)
    }
}

export async function creditCardDesactivationHandler(request: FastifyRequest<{
    Params: {id: string}
}>, reply: FastifyReply) {
    
    try {
        if(request.user) {
            const {role: roleFromToken} = request.user
            const creditCardId = Number(request.params.id)
            const creditCard = await getCreditCard(creditCardId)
    
            if(!creditCard) {
                return reply.status(notFound).send({error: 'Credit card not found'})
            }
    
            if(roleFromToken === 'employee' || roleFromToken === 'admin') {
                
                const creditCardDesactivated = await creditCardDesactivation(creditCardId)
    
                return reply.send(creditCardDesactivated)
            } else {
                return reply.code(unauthorized).send(permDenied)
            }
        } else {
            return reply.code(serverError).send({error: 'Server error'})
        }
    } catch(e) {
        return reply.code(serverError).send(e)
    } 

}

export async function getCreditCardsHandler() {
    const creditCards = await getCreditCards()

    return creditCards
}