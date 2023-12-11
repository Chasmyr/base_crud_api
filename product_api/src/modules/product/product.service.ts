import prisma from "../../utils/prisma";
import { CreateProductInput } from "./product.schema";

export const createProduct = async(data: CreateProductInput & {userId: number}) => {
    return prisma.product.create({
        data,
    })
}

export async function getAllProducts() {
    return prisma.product.findMany({
        select: {
            id: true,
            title: true,
            price: true,
            content: true,
        }
    })
}

export async function getProduct(productId:number) {
    return prisma.product.findUnique({
        where: {
            productId: productId
        }
    })
}


export async function removeProduct(productId: number) {
    return prisma.product.deleted({
        where: {
            productId: productId
        }
    })
}