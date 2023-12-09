import Fastify, { FastifyReply, FastifyRequest } from "fastify";
import userRoutes from "./modules/user/user.route";
import { userSchemas } from './modules/user/user.schema';
import cartRoutes from "./modules/cart/cart.route";
import { cartSchemas } from './modules/cart/cart.schema';
import productRoutes from "./modules/product/product.route";
import { productSchemas } from "./modules/product/product.schema";


export const server = Fastify({
    logger: {
        level: 'info'
    }
})

declare module "fastify" {
    export interface FastifyInstance {
        authenticate: any
    }
}

declare module "fastify-jwt" {
    interface FastifyJWT {
        user: {
            "email": string,
            "name": string,
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
    for (const schema of [...userSchemas, ...cartSchemas, ...productSchemas]){
        server.addSchema(schema)
    }

    server.register(userRoutes, {prefix: 'api/users'})

    server.register(cartRoutes, {prefix: 'api/cart'})

    server.register(productRoutes, {prefix: 'api/product'})
    
    try {
        await server.listen({port: 4001, host: '0.0.0.0'})
            console.log('serve rdy at http://localhost:4001')
    }catch(e) {
        console.error(e)
        process.exit(1)
    }
}
main()