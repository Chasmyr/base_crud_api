import { FastifyInstance } from "fastify";
import { createCartHandler, getProductsByCartHandler } from "./cart.controller";
import { $ref } from "./cart.schema";

async function cartRoutes(server: FastifyInstance) {

    // Create Cart
    server.post('/', {
        preHandler: [server.authenticate],
        schema: {
            body: $ref('createCartSchema'),
            response: {
                201: $ref('cartResponseSchema')
            }
        }
    }, createCartHandler)

    // Get All Cart
    server.get('/rtdfgfgdf', {
        schema: {
            response: {
                200: $ref('cartResponseSchema')
            }
        }
    }, getProductsByCartHandler)




    // server.delete('/', {
    //     schema: {
    //         body: $ref(removeProductFromCartSchema)
    //         response: {
    //             200: $ref('cartResponseSchema')
    //         }
    //     }
    // }, getCartsHandler)
}

export default cartRoutes