import { FastifyInstance } from "fastify";
import { createCartHandler, getCartsHandler } from "./cart.controller";
import { $ref } from "./cart.schema";

async function cartRoutes(server: FastifyInstance) {

    server.post('/', {
        preHandler: [server.authenticate],
        schema: {
            body: $ref('createCartSchema'),
            response: {
                201: $ref('cartResponseSchema')
            }
        }
    }, createCartHandler)

    server.get('/', {
        schema: {
            response: {
                200: $ref('cartsResponseSchema')
            }
        }
    }, getCartsHandler)
}

export default cartRoutes