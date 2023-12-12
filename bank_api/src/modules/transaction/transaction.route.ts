import { FastifyInstance } from "fastify/types/instance";
import { createTransactionHandler, getAllTransactionsFormCreditCard, getAllTransactionsFromBankAccount, getAllTransactionsFromUser } from "./transaction.controller";
import { $ref } from "./transaction.schema";

async function transactionRoutes(server: FastifyInstance) {

    // ajouter un pre handler qui va vérifier si la carte existe, si elle est active et s'il y a les fonds sur le compte
    server.post('/', {
        preHandler: [server.authenticate],
        schema: {
            body: $ref('createTransactionSchemaInput'),
            response: {
                201: $ref('createTransactionResponseSchema')
            }
        }
    }, createTransactionHandler)

    server.get('/card/:id', {
        preHandler: [server.authenticate],
    }, getAllTransactionsFormCreditCard)

    server.get('/bankaccount/:id', {
        preHandler: [server.authenticate],
    }, getAllTransactionsFromBankAccount)

    server.get('/', {
        preHandler: [server.authenticate],
    }, getAllTransactionsFromUser)
}

export default transactionRoutes