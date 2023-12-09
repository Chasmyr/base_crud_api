import { FastifyReply, FastifyRequest } from "fastify";
import { createCart, getAllCarts, addProductToCart, findCartByUserId, removeProductFromCart } from "./cart.service";
import { cartSchemas, CreateCartInput } from "./cart.schema";


    // Create Cart
//     export async function createCartHandler(request: FastifyRequest<{
//     Body: CreateCartInput
// }>) {

//     const { userId } = request.body;
//     const cart = await createCart(userId)
//     return cart
// }

// RECUPERER TOUT LES PANIER D'UN USER
export async function getAllCartsHandler(request: FastifyRequest<{ Params: { userId: number }}>) {
    const { userId } = request.params;
    const carts = await getAllCarts(userId);

    return carts;
}


// AJOUTER UN PRODUIT AU PANIER
export async function addProductToCartHandler(request: FastifyRequest<{ Params: { cartId: number, productId: number }, Body: {userId: number, status: boolean}}>) {
    let { cartId, productId} = request.params;
    let {status, userId} = request.body;

        if (status == false) {
        const newCart = await createCart(userId)
        cartId = newCart.id;
        }
    
    const cart = await addProductToCart(cartId, productId);
    return cart;
}

export async function removeProductHandler(request: FastifyRequest<{ Params: { cartId: number, productId: number } }>) {
    let { cartId , productId } = request.params;

    return await removeProductFromCart(cartId, productId);
    
}


// export async function removeAllProductHandler(request: FastifyRequest<{ 
//     Querystring: { userId: number } }>) {

//     const { userId } = request.query;
//     const cart = await findCartByUserId(userId);
//     if (!cart) {
//         throw new Error('Cart not found for the given user.');
//     }
//     const items = await getProductsByCart(cart.id);
    
//     return items;
// }
