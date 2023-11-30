import { FastifyInstance } from "fastify/types/instance";
import { $ref } from "./creditCard.schema";
import { createCreditCardHandler, creditCardActivationHandler, getCreditCardsHandler } from "./creditCard.controller";

async function creditCardRoutes(server: FastifyInstance) {
    
    server.post('/create', {
        schema: {
            body: $ref('createCreditCardSchema'),
            response: {
                201: $ref('createCreditCardResponseSchema')
            }
        }
    }, createCreditCardHandler)

    server.post('/activation', {
        schema: {
            body: $ref('creditCardAuthSchema'),
            response: {
                200:  $ref('creditCardAuthResponseSchema')
                }
        }
    }, creditCardActivationHandler)

    server.get('/all', {
        schema: {
            response: {
                200: $ref('creditCardsResponseSchema')
            }
        }
    }, getCreditCardsHandler)
}

export default creditCardRoutes