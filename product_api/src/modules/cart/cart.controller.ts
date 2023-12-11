import { FastifyReply, FastifyRequest } from "fastify";
import { createCart, getAllCarts, addProductToCart, removeProductFromCart, removeAllProductsFromCart, validateCart, deleteCart } from "./cart.service";
import { cartSchemas, CreateCartInput } from "./cart.schema";
import prisma from "../../utils/prisma";
import { log } from "console";

// Get user Cart
export async function getAllCartsHandler(request: FastifyRequest<{ Params: { userId: number }}>) {
    const { userId } = request.params;
    const carts = await getAllCarts(userId);
    return carts;
}


// Add product to Cart
export async function addProductToCartHandler(request: FastifyRequest<{ Params: { cartId: number, productId: number }, Body: {userId: number }}>) {
    let { cartId, productId } = request.params;
    let { userId } = request.body;
    // Check if cart already open
    const currentCart = await prisma.cart.findUnique({
        where: { id: cartId },
    })
    // If no cart open, open it
    if (!currentCart || currentCart.status === false) {        
        const newCart = await createCart(userId)
        cartId = newCart.id;
    }
    // Add product into cart
    const cart = await addProductToCart(cartId, productId, userId);
    return cart;
}


// Remove product from cart
export async function removeProductHandler(request: FastifyRequest<{ Params: { cartId: number, productId: number } }>) {
    let { cartId , productId } = request.params;
    return await removeProductFromCart(cartId, productId);
}


// Remove all product from cart
export async function removeAllProductsHandler(request: FastifyRequest<{ Params: { cartId: number } }>) {
    let { cartId } = request.params;
    const products = await removeAllProductsFromCart(cartId);
    return products;
}


// Delete Cart
export async function deleteCartHandler(request: FastifyRequest<{ Params: { cartId: number } }>) {
    let { cartId } = request.params;
    const cart = await deleteCart(cartId);
    return cart;
}


// Validate Cart
export async function validateCartHandler(request: FastifyRequest<{ Params: { cartId: number }}>) {
    let { cartId } = request.params;
    return await validateCart( cartId )
}