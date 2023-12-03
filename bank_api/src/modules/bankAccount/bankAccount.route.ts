import { FastifyInstance } from "fastify";
import { createBankAccountHandler, getBankAccountsHandler } from "./bankAccount.controller";
import { $ref } from "./bankAccount.schema";

async function bankAccountRoutes(server: FastifyInstance) {

    server.post('/', {
        preHandler: [server.authenticate],
        schema: {
            body: $ref('createBankAccountSchema'),
            response: {
                201: $ref('bankAccountResponseSchema')
            }
        }
    }, createBankAccountHandler)

    server.get('/', {}, getBankAccountsHandler)
}

export default bankAccountRoutes