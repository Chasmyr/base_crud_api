import { FastifyInstance } from "fastify/types/instance";
import { $ref } from "./creditCard.schema";
import { createCreditCardHandler, creditCardActivationHandler, creditCardDesactivationHandler, getCreditCardsHandler } from "./creditCard.controller";

async function creditCardRoutes(server: FastifyInstance) {
    
    server.post('/create', {
        schema: {
            body: $ref('createCreditCardSchema'),
            response: {
                201: $ref('createCreditCardResponseSchema')
            }
        }
    }, createCreditCardHandler)

    server.get('/activation/:id', {
        preHandler: [server.authenticate]
    }, creditCardActivationHandler)

    server.get('/desactivation/:id', {
        preHandler: [server.authenticate],
    }, creditCardDesactivationHandler)

    server.get('/all', {}, getCreditCardsHandler)
}

export default creditCardRoutes