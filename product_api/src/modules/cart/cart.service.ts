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
export const addProductToCart = async (cartId: number, productId: number) => {
  return prisma.cart.create({
    data: {
      cartId: cart.id,
      productId: productId,
    },
  });
};
  
// Get all carts
export const getAllCarts = async (userId: number) => {
  return prisma.cart.findMany({
    where: {
      userId: userId,
    },
    include: {
      product: true, 
    },
  });
};






// // Check if user have already a Cart
// export const findCartByUserId = async (userId: number) => {
//   const userIdInt = parseInt(userId, 10);

//   // Vérifier si la conversion est réussie
//   if (isNaN(userIdInt)) {
//     throw new Error('Invalid user ID');
//   }

//   return prisma.cart.findFirst({
//       where: {
//           userId: userIdInt,
//       },
//   });
// };

// export const removeProductFromCard = async (userId: number, productId: number) => {
//   return prisma.cart.productId.deleteMany ({
//     where: {
//       cartId: cartId,
//       productId: productId,
//     },
//   });
// };