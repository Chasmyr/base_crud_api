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
  // Create Cart
  const newCart = await prisma.cart.create({
      data: {
          userId,
          status: true,
      },
  });
  // Add Product
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



// Delete Cart
export const deleteCart = async ( cartId: number ) => {
  return prisma.cart.delete({
    where: {
      id: cartId,
    },
  })
}


