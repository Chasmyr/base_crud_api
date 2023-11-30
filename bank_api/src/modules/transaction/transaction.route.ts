import { FastifyInstance } from "fastify/types/instance";
import { createTransactionHandler, getTransactionsHandler } from "./transaction.controller";
import { $ref } from "./transaction.schema";

async function transactionRoutes(server: FastifyInstance) {

    server.post('/', {
        schema: {
            body: $ref('createTransactionSchema'),
            response: {
                201: $ref('createTransactionResponseSchema')
            }
        }
    }, createTransactionHandler)

    server.get('/all', {
        schema: {
            response: {
                200: $ref('transactionsResponseSchema')
            }
        }
    }, getTransactionsHandler)
}

export default transactionRoutes