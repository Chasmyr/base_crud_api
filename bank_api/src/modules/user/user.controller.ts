import { FastifyRequest, FastifyReply } from "fastify";
import { createUser, deleteUser, findUserByEmail, findUsers, updateUser } from "./user.service";
import { CreateUserInput, LoginInput } from "./user.schema";
import { verifyPassword } from "../../utils/hash";
import prisma from "../../utils/prisma";

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
        salt: user.salt,
        hash: user.password
    })

    if (correctPassword) {
        const {password, salt, ...rest} = user
        // generate access token
        return {accessToken: request.server.jwt.sign(rest)}
    }

    return reply.code(401).send({message: 'Invalid email or password'})
}

export async function deleteHandler(request:FastifyRequest, reply: FastifyReply) {

    const {id: idFromToken, role: roleFromToken} = request.user
    const userId = Number(request.params.id)
    
    try {
        if(idFromToken === userId || roleFromToken === 'admin') {
            const existingUser = await prisma.user.findUnique({
                where: {id: userId}
            })
    
            if(!existingUser) {
                return reply.status(404).send({error: 'User not found'})
            }
    
            const message = await deleteUser(userId)
    
            return reply.send(message)
        } else {
            return reply.code(401).send({error: 'Permission denied'})
        }
    } catch(e) {
        return reply.code(500).send(e)
    }
}

export async function updateHandler(request: FastifyRequest, reply: FastifyReply) {

    const {id: idFromToken, role: roleFromToken} = request.user
    const userId = Number(request.params.id)

    try {
        if(idFromToken === userId || roleFromToken === 'admin') {
            const existingUser = await prisma.user.findUnique({
                where: {id: userId}
            })
    
            if(!existingUser) {
                return reply.status(404).send({error: 'User not found'})
            }
    
            const updatedUser = await updateUser(userId, request.body)
    
            return reply.send(updatedUser)
        } else {
            return reply.code(401).send({error: 'Permission denied'})
        }
    } catch(e) {
        return reply.code(500).send(e)
    }
}

export async function getUsersHandler() {
    const users = await findUsers()

    return users
}