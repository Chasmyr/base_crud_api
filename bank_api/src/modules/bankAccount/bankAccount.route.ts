import { FastifyInstance } from "fastify";
import { createBankAccountHandler, deleteHandler, getBankAccountsHandler } from "./bankAccount.controller";
import { $ref, bankAccountSchemas } from "./bankAccount.schema";

async function bankAccountRoutes(server: FastifyInstance) {

    // create bank account
    server.post('/', {
        preHandler: [server.authenticate],
        schema: {
            body: $ref('createBankAccountSchema'),
            response: {
                201: $ref('bankAccountResponseSchema')
            }
        }
    }, createBankAccountHandler)

    // delete bank account
    server.delete('/:id', {
        preHandler: [server.authenticate]
    }, 
    deleteHandler)

    server.get('/', {
        schema: {
            response: {
                200: $ref('bankAccountsSchema')
            }
        }
    }, getBankAccountsHandler)
}

export default bankAccountRoutes