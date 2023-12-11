import { FastifyInstance } from "fastify";
import { getAllCartsHandler, addProductToCartHandler, removeProductHandler, removeAllProductsHandler, validateCartHandler, deleteCartHandler } from "./cart.controller";
import { $ref } from "./cart.schema";

async function cartRoutes(server: FastifyInstance) {

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
            body: $ref('getCartsSchema'),
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


    // Remove All Product 
    server.delete('/:cartId/products/', {
        schema: {
            params: $ref('removeAllProductsFromCartSchema'),
            response: {}
        } 
    }, removeAllProductsHandler);


    // Delete Cart
    server.delete('/:cartId', {
        schema: {
            params: $ref('removeAllProductsFromCartSchema'),
            response: {}
        } 
    }, deleteCartHandler);

    
    // Validate Cart
    server.post('/:cartId/validate', {
        schema: {
            params: $ref('validateCartSchema'),
            response: {}
        }
    }, validateCartHandler);
}

export default cartRoutes