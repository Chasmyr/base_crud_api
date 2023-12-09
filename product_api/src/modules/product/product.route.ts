import { FastifyInstance } from "fastify";
import { createProductHandler, getProductHandler, getAllProductsHandler, removeProductHandler } from "./product.controller";
import { $ref } from "./product.schema";

async function productRoutes(server: FastifyInstance) {

    // Create product
    server.post('/', {
        preHandler: [server.authenticate],
        schema: {
            body: $ref('createProductSchema'),
            response: {
                201: $ref('productResponseSchema')
            }
        }
    }, createProductHandler)

    // Get All products
    server.get('/', {
        schema: {
            response: {
                200: $ref('productsResponseSchema')
            }
        }
    }, getAllProductsHandler)

    //  Get Details of product 
    server.get('/:productId', {
        schema: {
            response: {
                200: $ref('productsResponseSchema')
            }
        }
    }, getProductHandler)

    //  Delete product 
    server.delete('/:productId', {
        schema: {
            response: {
                200: $ref('productsResponseSchema')
            }
        }
    }, removeProductHandler)
}

export default productRoutes