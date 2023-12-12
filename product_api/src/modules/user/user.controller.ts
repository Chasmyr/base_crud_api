import { FastifyRequest, FastifyReply } from "fastify";
import { createUser, findUserByEmail, findUsers } from "./user.service";
import { CreateUserInput, LoginInput } from "./user.schema";
import { verifyPassword } from "../../utils/hash";
import { server } from "../../app";
import { createCart } from "../cart/cart.service";
import { findCartByUserId } from "../cart/cart.service";

export async function registerUserHandler(
    request:FastifyRequest<{
        Body: CreateUserInput
    }>, 
    reply:FastifyReply) {
        
        const body = request.body
        
        try {
            const user = await createUser(body)

            return reply.code(201).send(user)
        } catch(e) {
            console.log(e)
            return reply.code(500).send(e)
        }
}

export async function loginHandler(request:FastifyRequest<{
    Body: LoginInput
}>, reply:FastifyReply) {
    
    const body = request.body

    // find a user by email
    const user = await findUserByEmail(body.email)

    if(!user) return reply.code(401).send({message: 'Invalid email or password'})

    // verifry password
    const correctPassword = verifyPassword({
        candidatePassword: body.password,
        role: user.role,
        hash: user.password
    })

    if (correctPassword) {
        // create cart if user don't already have
        const existingCart = await findCartByUserId(user.id);
        if (!existingCart) {
            await createCart(user.id);
        }

        const {password, role, ...rest} = user
        // generate access token
        return {accessToken: request.server.jwt.sign(rest)}


    }

    return reply.code(401).send({message: 'Invalid email or password'})
}

export async function getUsersHandler() {
    const users = await findUsers()

    return users
}