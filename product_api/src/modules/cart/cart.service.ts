import { primitiveMappings } from "zod-to-json-schema/src/parsers/union";
import prisma from "../../utils/prisma";
import { number } from "zod";

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
  

//Validate Cart / Go to cart
export const validateCart = async (userId: number, products: { productId: number; quantity: number}[]) => {
  // Check if cart with true status exist
  const existingOpenCart = await prisma.cart.findUnique({
    where: {
      id: userId,
      status: true,
    }
  })
  
  // If not create an populate
  if (!existingOpenCart) {
    const newCart = await prisma.cart.create({
        data: {
            userId,
            status: true,
        },
    });
    for (const { productId, quantity } of products) {
      await prisma.cartItem.create({
        data: {
          cartId: newCart.id,
          productId,
          quantity,
        },
      });
    }
    return newCart;
  } else {
    for (const { productId, quantity } of products) {
      await prisma.cartItem.create({
        data: {
          cartId: cartId,
          productId,
          quantity,
        },
      });
    }
    return newCart;
  }
} 


// Remove all product from cart / Back button from cart
export const deleteAllProductFromCart = async (cartId: number) => {
  await prisma.cartItem.deleteMany({
    where: {
      cartId: cartId,
    },
  });
};


// Payment of cart
export const processCart = async (cartId: number, status: boolean) => {
  await prisma.cart.update({
    where: {
      cartId: cartId,
    },
    data: {
      status: false, 
    }
  })
}


// Delete Cart
export const deleteCart = async ( cartId: number ) => {
  return prisma.cart.delete({
    where: {
      id: cartId,
    },
  })
}


