import prisma from "../../utils/prisma";
import { cartSchemas, $ref } from './cart.schema';

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
    where: { cartId: cartId },
  });

  if (!cart) {
    cart = await createCart(cartId);
  }

  return prisma.cartItem.create({
    data: {
      cartId: cart.id,
      productId,
    },
  });
};
  
// Get all carts
export const getProductsByCart = async (cartId: number) => {
  return prisma.cartItem.findMany({
    where: {
      cartId: cartId,
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

// export const removeProductFromCard = async (userId: number, productId: number) => {
//   return prisma.cart.productId.deleteMany ({
//     where: {
//       cartId: cartId,
//       productId: productId,
//     },
//   });
// };