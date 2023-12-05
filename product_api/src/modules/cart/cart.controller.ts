import { FastifyReply, FastifyRequest } from "fastify";
import { createCart, addToCart, getProductsByCart, findCartByUserId, removeProductFromCard } from "./cart.service";
import { cartSchemas, CreateCartInput } from "./cart.schema";

export async function createCartHandler(request: FastifyRequest<{
    Body: CreateCartInput
}>) {

    const { userId } = request.body;
    const cart = await createCart(userId)
    return cart
}

export async function getProductsByCartHandler(request: FastifyRequest<{ 
    Body: { cartId: number } }>) {

    const { cartId } = request.body;
    const items = await getProductsByCart(cartId);
    
    return items;

}

// export async function removeProductFromCartHandler() {
//     const cart = await getProductsByCart()

//     return cart
// }
