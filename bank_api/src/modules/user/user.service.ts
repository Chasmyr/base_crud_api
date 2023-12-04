import { hashPassword } from "../../utils/hash";
import prisma from "../../utils/prisma";
import { CreateUserInput, UserUpdateSchema } from "./user.schema";

export async function createUser(input: CreateUserInput){

    const {password, ...rest} = input

    const {hash, salt} = hashPassword(password)

    const user = await prisma.user.create({
        data: {...rest, salt, password: hash},
    })

    return user
}

export async function deleteUser(id: number) {
    
    const user = await prisma.user.delete({
        where: { id: id }
    })

    const message = {message: `User ${user.firstName} with id ${user.id} has been deleted`}

    return message
}

export async function updateUser(id: number, body: UserUpdateSchema) {

    const {password} = body
    let updateData = body

    if(password) {
        const {hash, salt} = hashPassword(password)
        updateData = {...updateData, salt, password: hash}
    }
    
    const updatedUser = await prisma.user.update({
        where: {id: id},
        data: updateData
    })
    return updatedUser
}

export async function findUserByEmail(email:string) {
    return prisma.user.findUnique({
        where: {
            email,
        }
    })
}

export async function getUser(id: number) {
    return prisma.user.findUnique({
        where: {id: id}
    })
}

export async function findUsers() {
    return prisma.user.findMany({
        select: {
            email: true,
            firstName: true,
            lastName: true,
            role: true,
            id: true
        }
    });
}