import prisma from "../../utils/prisma";
import { CreateCartInput } from "./cart.schema";

// Create cart for current user
export const createCart = async (userId: number) => {
    return prisma.cart.create({
      data: {
        userId,
        status: true, 
      },
    });
  };
  
  // Add product to Cart
  export const addToCart = async (cartId: number, productId: number) => {
    return prisma.cartItem.create({
      data: {
        cartId,
        productId,
      },
    });
  };
  
  // Get product from Cart
  export const getCarts = async (cartId: number) => {
    return prisma.cartItem.findMany({
      where: {
        cartId,
      },
      include: {
        product: true, 
      },
    });
  };