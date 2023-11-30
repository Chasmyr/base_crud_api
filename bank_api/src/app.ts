import Fastify, { FastifyReply, FastifyRequest } from "fastify";
import userRoutes from "./modules/user/user.route";
import { userSchemas } from './modules/user/user.schema'
import { bankAccountSchemas } from "./modules/bankAccount/bankAccount.schema";
import bankAccountRoutes from "./modules/bankAccount/bankAccount.route";
import creditCardRoutes from "./modules/creditCard/creditCard.route";
import { creditCardSchemas } from "./modules/creditCard/creditCard.schema";
import { transactionSchemas } from "./modules/transaction/transaction.schema";
import transactionRoutes from "./modules/transaction/transaction.route";

export const server = Fastify()

declare module "fastify" {
    export interface FastifyInstance {
        authenticate: any
    }
}

declare module "fastify-jwt" {
    interface FastifyJWT {
        user: {
            "email": string,
            "firstName": string,
            "lastName": string,
            "id": number
        }
    }
}

server.register(require('@fastify/jwt'), {
    secret: 'hajlazjlejamlzlmsofopoajramspofa'
})

server.decorate('authenticate', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        await request.jwtVerify()
    } catch(e) {
        return reply.send(e)
    }
})

server.get('/healthcheck', async function() {
    return {status: 'OK'}
})

async function main() {
    for (const schema of [...userSchemas, ...bankAccountSchemas, ...creditCardSchemas, transactionSchemas]){
        server.addSchema(schema)
    }

    server.register(userRoutes, {prefix: 'api/users'})
    server.register(bankAccountRoutes, {prefix: 'api/bankaccounts'})
    server.register(creditCardRoutes, {prefix: 'api/creditcards'})
    server.register(transactionRoutes, {prefix: 'api/transactions'})
    
    try {
        await server.listen(4002, '0.0.0.0')
        console.log('serve rdy at http://localhost:4002')
    }catch(e) {
        console.error(e)
        process.exit(1)
    }
}
main()