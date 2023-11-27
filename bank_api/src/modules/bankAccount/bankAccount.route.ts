import { FastifyInstance } from "fastify";
import { createBankAccountHandler, getBankAccountsHandler } from "./bankAccount.controller";
import { $ref } from "./bankAccount.schema";
import { getBankAccounts } from "./bankAccount.service";

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

    server.get('/', {
        schema: {
            response: {
                200: $ref('bankAccountsSchema')
            }
        }
    }, getBankAccounts)
}

export default bankAccountRoutes