import { FastifyInstance } from "fastify";
import { createCartHandler, validateCartHandler, getAllCartsHandler, deleteAllProductFromCartHandler, deleteCartHandler } from "./cart.controller";
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
    server.post('/:cartId/validate', {
        schema: {
            params: $ref('validateCartParamsSchema'),
            body: $ref('validateCartBodySchema'),
            response: {
                201: $ref('cartResponseSchema')
            }
        }
    }, validateCartHandler);

    // Get All cart by user
    server.get('/:userId', {
        schema: {
            params: $ref('getCartSchema'),
            response: {
                201: $ref('getCartProductsSchema')
            }
        }
    }, getAllCartsHandler)


    // Remove All Product / Back Button
    server.delete('/:cartId/products/', {
        schema: {
            params: $ref('removeAllProductsFromCartParamsSchema'),
            response: {}
        } 
    }, deleteAllProductFromCartHandler);


    // Payment Cart


    

    // Delete Cart
    server.delete('/:cartId', {
        schema: {
            params: $ref('removeAllProductsFromCartParamsSchema'),
            response: {}
        } 
    }, deleteCartHandler);
}

export default cartRoutes