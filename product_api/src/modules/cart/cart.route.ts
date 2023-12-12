import { FastifyInstance } from "fastify";
import { createCartHandler, validateCartHandler, getAllCartsHandler, deleteAllProductFromCartHandler, deleteCartHandler, processCartHandler } from "./cart.controller";
import { $ref } from "./cart.schema";


async function cartRoutes(server: FastifyInstance) {

    //Create Cart
    server.post('/' , {
        preHandler: [server.authenticate],
        schema: {
            body: $ref('postCartBodySchema'),
            response: {
                201: $ref('getCartSchema')
            }
        }
    }, createCartHandler)

    // Validate Cart / Go to Cart
    server.post('/:userId/validate', {
        schema: {
            params: $ref('userIdSchema'),
            body: $ref('validateCartBodySchema'),
            response: {
                201: $ref('cartResponseSchema')
            }
        }
    }, validateCartHandler);

    // Get All cart by user
    server.get('/:userId', {
        schema: {
            params: $ref('userIdSchema'),
            response: {
                201: $ref('getCartProductsSchema')
            }
        }
    }, getAllCartsHandler)


    // Remove All Product / Back Button
    server.delete('/:cartId/products/', {
        schema: {
            params: $ref('cartIdSchema'),
            response: {}
        } 
    }, deleteAllProductFromCartHandler);


    // Payment Cart
    server.post('/:cartId/process', {
        schema: {
            params: $ref('cartIdSchema'),
            body: $ref('processCartBodySchema'),
            response: {}
        }
    }, processCartHandler)

    

    // Delete Cart
    server.delete('/:cartId', {
        schema: {
            params: $ref('cartIdSchema'),
            response: {}
        } 
    }, deleteCartHandler);
}

export default cartRoutes