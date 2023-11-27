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
    let cart = await prisma.cart.findUnique({
      where: { userId },
    });
  
    if (!cart) {
      cart = await createCart(userId);
    }
  
    return prisma.cartItem.create({
      data: {
        cartId: cart.id,
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

  // Check if user have already a Cart
  export const findCartByUserId = async (userId: number) => {
    return prisma.cart.findFirst({
        where: {
            userId: userId,
        },
    });
};