import Fastify, { FastifyReply, FastifyRequest } from "fastify";
import userRoutes from "./modules/user/user.route";
import { userSchemas } from './modules/user/user.schema'

export const server = Fastify()

server.register(require('@fastify/jwt'), {
    secret: 'hajlazjlejamlzlmsofopoajramspofa'
})

server.decorate('authenticate', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        await request.server.jwtVerify()
    } catch(e) {
        return reply.send(e)
    }
})

server.get('/healthcheck', async function() {
    return {status: 'OK'}
})

async function main() {
    for (const schema of userSchemas){
        server.addSchema(schema)
    }

    server.register(userRoutes, {prefix: 'api/users'})
    
    try {
        await server.listen(3000, '0.0.0.0')
        console.log('serve rdy at http://localhost:3000')
    }catch(e) {
        console.error(e)
        process.exit(1)
    }
}
main()