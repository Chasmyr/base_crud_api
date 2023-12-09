import { FastifyInstance } from "fastify";
import { createCartHandler, getAllCartsHandler, addProductToCartHandler, removeProductHandler, removeAllProductHandler } from "./cart.controller";
import { $ref } from "./cart.schema";

async function cartRoutes(server: FastifyInstance) {

    // Create Cart
    // server.post('/', {
    //     preHandler: [server.authenticate],
    //     schema: {
    //         body: $ref('createCartSchema'),
    //         response: {
    //             201: $ref('cartResponseSchema')
    //         }
    //     }
    // }, createCartHandler)

    // Get All cart by user
    server.get('/:userId', {
        schema: {
            params: $ref('getCartsSchema'),
            response: {
                201: $ref('cartResponseSchema')
            }
        }
    }, getAllCartsHandler)


    // Add product to Cart
    server.post('/:cartId/products/:productId', {
        preHandler: [server.authenticate],
        schema: {
            body: $ref('createCartSchema'),
            params: $ref('getCartProductSchema'),
            response: {
                201: $ref('cartResponseSchema')
            }
        }
    }, addProductToCartHandler)



    // Remove product
    server.delete('/:cartId/products/:productId', {
        schema: {
            params: $ref('getCartProductSchema'),
            response: {}
        } 
    }, removeProductHandler);

    // Remove product 
    // server.delete('/:cartId/products/:productId', {
    //     schema: {
    //         params: $ref('getCartProductSchema'),
    //         response: {
    //             200: $ref('cartsResponseSchema')
    //         }
    //     } 
    // }, removeProductHandler);

    // // Remove all products
    // server.delete('/:cartId/products/', {
    //     schema: {
    //         response: {
    //             200: $ref('cartsResponseSchema')
    //         }
    //     } 
    // }, removeAllProductHandler);
}

export default cartRoutes