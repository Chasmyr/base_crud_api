import { FastifyRequest, FastifyReply } from "fastify";
import { createUser, deleteUser, findUserByEmail, findUsers, getUser, updateUser } from "./user.service";
import { CreateUserInput, LoginInput, UserRequestSchema, UserUpdateSchema } from "./user.schema";
import { verifyPassword } from "../../utils/hash";
import { created, notFound, serverError, unauthorized } from "../../utils/const";
import { idAndRoleMiddleware } from "../../utils/middleware";

export async function registerUserHandler(
    request:FastifyRequest<{
        Body: CreateUserInput
    }>, 
    reply:FastifyReply) {
        
        const body = request.body
        
        try {
            const user = await createUser(body)

            return reply.code(created).send(user)
        } catch(e) {
            return reply.code(serverError).send(e)
        }
}

export async function loginHandler(request:FastifyRequest<{
    Body: LoginInput
}>, reply:FastifyReply) {
    
    const body = request.body

    // find a user by email
    const user = await findUserByEmail(body.email)

    if(!user) return reply.code(unauthorized).send({message: 'Invalid email or password'})

    // verifry password
    const correctPassword = verifyPassword({
        candidatePassword: body.password,
        role: user.role,
        hash: user.password
    })

    if (correctPassword) {
        const {password, role, ...rest} = user
        // generate access token
        return {accessToken: request.server.jwt.sign(rest)}
    }

    return reply.code(unauthorized).send({message: 'Invalid email or password'})
}

export async function deleteHandler(request:FastifyRequest<{
    Params: {id: string}
}>, reply: FastifyReply) {
        
    try {
        if(request.user) {
            const {id: idFromToken, role: roleFromToken} = request.user
            const userId = Number(request.params.id)
            if(idAndRoleMiddleware({id1: idFromToken, id2: userId}, true, roleFromToken, ['admin'])) {
                const existingUser = await getUser(userId)
        
                if(!existingUser) {
                    return reply.status(notFound).send({error: 'User not found'})
                }
                
                const message = await deleteUser(userId)
        
                return reply.send(message)
            } else {
                return reply.code(unauthorized).send({error: 'Permission denied'})
            }
        } else {
            return reply.code(serverError).send({error: 'Server error'})
        }
    } catch(e) {
        return reply.code(serverError).send(e)
    }
}

export async function updateHandler(request: FastifyRequest<{
    Body: UserUpdateSchema,
    User: UserRequestSchema,
    Params: {id: string}
}>, reply: FastifyReply) {
    
    try {
        if(request.user) {
            const {id: idFromToken, role: roleFromToken} = request.user
            const userId = Number(request.params.id)
            if(idAndRoleMiddleware({id1: idFromToken, id2: userId}, true, roleFromToken, ['admin'])) {
                const existingUser = await getUser(userId)
        
                if(!existingUser) {
                    return reply.status(notFound).send({error: 'User not found'})
                }
        
                const updatedUser = await updateUser(userId, request.body)
        
                return reply.send(updatedUser)
            } else {
                return reply.code(unauthorized).send({error: 'Permission denied'})
            }
        } else {
            reply.code(serverError).send({error: 'Server error'})
        }
    } catch(e) {
        return reply.code(serverError).send(e)
    }
} 

export async function getUsersHandler() {
    const users = await findUsers()

    return users
}