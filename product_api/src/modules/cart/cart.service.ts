import { primitiveMappings } from "zod-to-json-schema/src/parsers/union";
import prisma from "../../utils/prisma";

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
export const addProductToCart = async (cartId: number, productId: number, userId: number) => {
  // Check cart
  console.log("service addProductToCart");
  
  let cart = await prisma.cart.findUnique({
    where: {
      id: cartId,
    },
  });
  // If the cart status is false, create cart
  if (!cart || cart.status == false) {
    cart = await prisma.cart.create({
      data: {
        userId: userId,
        status: true,
      }
    })
  }
  // check if product already in cart
  const existingProduct = await prisma.product.findFirst({
    where: {
        cartId: cartId,
        id: productId,
    },
  });
  // If the product exist, add quantity
  if (existingProduct) {
      return prisma.product.update({
          where: {
              id: productId,
          },
          data: {
              quantity: existingProduct.quantity + 1,
          },
      });
  // else, add to cart
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
  

export const removeProductFromCart = async (cartId: number, productId: number) => {
  const productInCart = await prisma.product.findFirst({
    where: {
      cartId: cartId,
      id: productId,
    }
  })

  if (productInCart && productInCart.quantity > 1) {
    return prisma.product.update({
      where: {
          id: productId,
      },
      data: {
          quantity: productInCart.quantity - 1,
      },
  });
  } else {
    return prisma.product.delete ({
      where: {
        id: productId,
      },
    });
  }
};


export const removeAllProductsFromCart = async (cartId: number) => {
  return prisma.product.deleteMany({
    where: {
      cartId: cartId,
    }
  })
}


export const deleteCart = async ( cartId: number ) => {
  return prisma.cart.delete({
    where: {
      id: cartId,
    },
  })
}


export const validateCart = async ( cartId: number ) => {
  return prisma.cart.update({
    where: {
      id: cartId,
    },
    data: {
      status: false,
    }
  })
}