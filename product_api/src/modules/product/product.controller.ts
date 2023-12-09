import { FastifyReply, FastifyRequest } from "fastify";
import { createProduct, getProduct, getAllProducts, removeProduct } from "./product.service";
import { CreateProductInput } from "./product.schema";

export async function createProductHandler(request: FastifyRequest<{ Body: CreateProductInput}>) {

    const product = await createProduct({
        ...request.body,
        userId: request.user.id
    })
    return product
}

export async function getAllProductsHandler() {
    const products = await getAllProducts()
    return products
}

export async function getProductHandler(request: FastifyRequest<{ Params: { productId: number }}>) {
    const { productId } = request.params;
    const product = await getProduct(productId);

    return product;
}

export async function removeProductHandler(request: FastifyRequest<{ Params: { productId: number }}>) {
    const { productId } = request.params;
    const products = await removeProduct(productId)

    return { message: 'Product successfully deleted'};
}
