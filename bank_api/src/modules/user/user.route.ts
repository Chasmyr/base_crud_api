import { FastifyInstance } from "fastify";
import { getUsersHandler, loginHandler, registerUserHandler, deleteHandler, updateHandler } from "./user.controller";
import { $ref } from "./user.schema";

async function userRoutes(server:FastifyInstance) {

    // create user
    server.post('/', {
        schema: {
            body: $ref("createUserSchema"),
            response:{
                201: $ref('createUserResponseSchema')
            }
        }
    },registerUserHandler)

    // delete user
    server.delete('/delete/:id', {
        preHandler: [server.authenticate],
    }, deleteHandler)

    // update user
    server.put('/update/:id', {
        preHandler: [server.authenticate],
        schema: {
            response: {
                200: $ref('createUserResponseSchema')
            }
        }
    }, updateHandler)
    
    // login
    server.post('/login', {
        schema: {
            body: $ref('loginSchema'),
            response: {
                200: $ref('loginResponseSchema')
            }
        }
    }, loginHandler)
    
    // get all users
    server.get('/', {
        preHandler: [server.authenticate]
    }, getUsersHandler)
}

export default userRoutes