import { FastifyInstance } from "fastify/types/instance";
import { $ref } from "./creditCard.schema";
import { createCreditCardHandler, creditCardActivationHandler, creditCardDesactivationHandler, getCreditCardHanlder, getCreditCardsHandler } from "./creditCard.controller";
import { deleteHandler } from "../user/user.controller";

async function creditCardRoutes(server: FastifyInstance) {
    
    server.post('/:id', {
        preHandler: [server.authenticate],
        schema: {
            body: $ref('createCreditCardSchema'),
            response: {
                201: $ref('createCreditCardResponseSchema')
            }
        }
    }, createCreditCardHandler)

    server.delete('/:id', {
        preHandler: [server.authenticate],
    }, deleteHandler)

    server.get('/activation/:id', {
        preHandler: [server.authenticate]
    }, creditCardActivationHandler)

    server.get('/desactivation/:id', {
        preHandler: [server.authenticate],
    }, creditCardDesactivationHandler)

    server.get('/', {
        preHandler: [server.authenticate],
    }, getCreditCardsHandler)

    server.get('/:id', {
        preHandler: [server.authenticate],
    }, getCreditCardHanlder)
}

export default creditCardRoutes