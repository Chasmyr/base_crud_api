import { FastifyReply, FastifyRequest } from "fastify";
import { createCart, getAllCarts, deleteAllProductFromCart, validateCart, deleteCart, processCart } from "./cart.service";
import { cartSchemas, CreateCartInput } from "./cart.schema";
import prisma from "../../utils/prisma";
import { log } from "console";



// Create Cart
export async function createCartHandler(request: FastifyRequest<{ Body: { userId: number }}>) {
    const { userId } = request.body;
    const carts = await createCart(userId);
    return carts;
}


//Validate Cart / Add Product to Cart
export async function validateCartHandler(request: FastifyRequest<{ Params: { cartId: number}, Body:{ products: { productId: number; quantity: number }[]}}>) {
    const { cartId } = request.params; 
    const { products } = request.body;

    const cart = await validateCart(cartId, products);
    return cart
}

// Get All user Cart
export async function getAllCartsHandler(request: FastifyRequest<{ Params: { userId: number }}>) {
    const { userId } = request.params;
    const carts = await getAllCarts(userId);
    return carts;
}



// Remove all product from cart
export async function deleteAllProductFromCartHandler( request: FastifyRequest<{ Params: { cartId: number } }>) {
    const { cartId } = request.params;
    return deleteAllProductFromCart(cartId);
}

//Process Cart
export async function processCartHandler(request : FastifyRequest<{ Params: {cartId: number}, Body: {status: boolean}}>) {
    const { cartId } = request.params;
    const { status } = request.body;

    return processCart(cartId, status)
}


// Delete Cart
export async function deleteCartHandler(request: FastifyRequest<{ Params: { cartId: number } }>) {
    let { cartId } = request.params;
    const cart = await deleteCart(cartId);
    return cart;
}