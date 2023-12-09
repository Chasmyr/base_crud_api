import { primitiveMappings } from "zod-to-json-schema/src/parsers/union";
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
  
  
  // Get all carts
  export const getAllCarts = async (userId: number) => {
    return prisma.cart.findMany({
      where: {
        userId: userId,
      },
      include: {
        products: true, 
      },
    });
  };
  


// Add product to Cart
export const addProductToCart = async (cartId: number, productId: number) => {
  const existingProduct = await prisma.product.findFirst({
    where: {
        cartId: cartId,
        id: productId,
    },
  });

  if (existingProduct) {
      return prisma.product.update({
          where: {
              id: productId,
          },
          data: {
              quantity: existingProduct.quantity + 1,
          },
      });
  } else {
    return prisma.cart.update({
      where: {
        id: cartId,
      },
      data: {
        products: {
          connect: [{id: productId }],
        },
        status: true
      },
    });
  };
};


// export const addProductToCart = async (cartId: number, productId: number) => {
//   return prisma.cart.update({
//     where: {
//       id: cartId,
//     },
//     data: {
//       products: {
//         connect: [{id: productId }],
//       },
//       status: true
//     },
//   });
// };
  
  

export const removeProductFromCart = async (cartId: number, productId: number) => {
  const productInCart = await prisma.product.findFirst({
    where: {
      cartId: cartId,
      id: productId,
    }
  })

  if (productInCart && productInCart.quantity > 1) {
    console.log("Test", productInCart)
    return prisma.product.update({
      where: {
          id: productId,
      },
      data: {
          quantity: productInCart.quantity - 1,
      },
  });
  } else {
    console.log("product in cart", productInCart)
    return prisma.product.delete ({
      where: {
        id: productId,
      },
    });
  }
};
