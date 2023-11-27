import { FastifyReply, FastifyRequest } from "fastify";
import { createCart, getCarts } from "./cart.service";
import { CreateCartInput } from "./cart.schema";

export async function createCartHandler(request: FastifyRequest<{
    Body: CreateCartInput
}>) {

    const cart = await createCart({
        ...request.body,
        ownerId: request.user.id
    })

    return cart
}

export async function getCartsHandler() {
    const carts = await getCarts()

    return carts
}

