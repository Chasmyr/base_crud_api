import Fastify, { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import userRoutes from "./modules/user/user.route";
import { userSchemas } from './modules/user/user.schema'
import { bankAccountSchemas } from "./modules/bankAccount/bankAccount.schema";
import bankAccountRoutes from "./modules/bankAccount/bankAccount.route";
import creditCardRoutes from "./modules/creditCard/creditCard.route";
import { creditCardSchemas } from "./modules/creditCard/creditCard.schema";
import { transactionSchemas } from "./modules/transaction/transaction.schema";
import transactionRoutes from "./modules/transaction/transaction.route";
import fastifyJwt, { FastifyJWTOptions } from '@fastify/jwt'

declare module "fastify" {
    export interface FastifyRequest {
        authenticate: UserToken;
        creditCard: CreditCardToken;
    }

    export interface FastifyInstance {
        authenticate: any
    }
}

interface UserToken {
    user: {
        "email": string,
        "firstName": string,
        "lastName": string,
        "id": number,
        "role": string
    }
}

interface CreditCardToken {
    creditCard: {
        "creditCardNumber": string,
        "expiration": string,
        "cvv": number,
        "id": number
    }
}

function buildServer(): FastifyInstance {
    const server = Fastify()
    
    server.register(require('@fastify/jwt'), {
        secret: 'hajlazjlejamlzlmsofopoajramspofa' // besoin de lécrire en clair pour passer les tests
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

    
    for (const schema of [...userSchemas, ...bankAccountSchemas, ...creditCardSchemas, ...transactionSchemas]){
        server.addSchema(schema)
    }

    server.register(userRoutes, {prefix: 'api/users'})
    server.register(bankAccountRoutes, {prefix: 'api/bankaccounts'})
    server.register(creditCardRoutes, {prefix: 'api/creditcards'})
    server.register(transactionRoutes, {prefix: 'api/transactions'})

    return server
}

export default buildServer