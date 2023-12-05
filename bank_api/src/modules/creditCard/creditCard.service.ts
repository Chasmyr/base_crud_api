import prisma from "../../utils/prisma";
import { getRandomCVV, getRandomCreditCardNumber } from "../../utils/random";
import { CreateCreditCardInput } from "./creditCard.schema";
import { FastifyRequest } from "fastify";
import CryptoJS from "crypto-js"

export async function createCreditCard(input: CreateCreditCardInput){

    const {expiration, accountId} = input

    const creditCardNumber = getRandomCreditCardNumber()
    const cvv = getRandomCVV()

    const creditCard = await prisma.creditCard.create({
        data: {expiration, creditCardNumber, cvv, accountId}
    })

    return creditCard
}

export async function deleteCreditCard(id: number) {

    const creditCard = await prisma.creditCard.delete({
        where: { id: id }
    })

    const message = {message: `Credit card with id ${creditCard.id} has been deleted`}

    return message
}

export async function updateCreditCard(id: number, body: object) {

    const updatedCreditCard = await prisma.creditCard.update({
        where: {id: id},
        data: body
    })

    return updatedCreditCard
}

export async function creditCardActivation(request: FastifyRequest, id: number) {
    
    const creditCard = await prisma.creditCard.findUnique({
        where: {id: id}
    })

    if(creditCard?.token === "" && !creditCard?.isActive) {
        const encryptionKey = process.env.KEY || ""
        const {token, isActive, accountId, ...rest} = creditCard
        const newToken = request.server.jwt.sign(rest)
        const encryptedToken = CryptoJS.AES.encrypt(newToken, encryptionKey)
        // const decryptedToken = CryptoJS.AES.decrypt(encryptedToken.toString(), encryptionKey)
        // console.log(decryptedToken.toString(CryptoJS.enc.Utf8))
        // encryptedToken.toString()
        const toUpdate = {
            "token": newToken,
            "isActive": true
        }
        const updatedCreditCard = await prisma.creditCard.update({
            where: {id: id},
            data: toUpdate
        })
        return {"message": `The credit card with id ${id} is active`}
    } else if (creditCard?.isActive) {
        return {"message": `The credit card with id ${id} is already active`}
    } else {
        return {"message": `The credit card with id ${id} have been desactivated`}
    }
}

export async function creditCardDesactivation(id: number) {
    
    const creditCard = await prisma.creditCard.findUnique({
        where: {id: id}
    })
    if (creditCard?.isActive) {
        const toUpdate = {
            "isActive": false
        }
        const updatedCreditCard = await prisma.creditCard.update({
            where: {id: id},
            data: toUpdate
        })
        return {"message": `The credit card with id ${id} has been desactivated`}
    } else {
        return {"message": `The credit card with id ${id} can't be desactivated`}
    }
}

export async function getCreditCard(id:number) {
    const creditCard = await prisma.creditCard.findUnique({
        where: {id: id}
    })
    return creditCard
}

export async function getBankAccountFromCreditCard(id: number) {
    const cardAccount = await prisma.bankAccount.findFirst({
        where: {id: id}
    })
    return cardAccount
}

export async function isCreditCardCredentialsOk(id: number, creditCardNumber: string, expiration: string, cvv: number) {
    
    const creditCard = await prisma.creditCard.findUnique({
        where: {id: id}
    })
    
    return creditCard?.creditCardNumber === creditCardNumber && creditCard?.expiration === expiration && creditCard?.cvv === cvv && creditCard?.isActive
}

export async function getCreditCards() {
    return await prisma.creditCard.findMany({
        select: {
            creditCardNumber: true,
            expiration: true,
            cvv: true,
            isActive: true,
            id: true,
            token: true,
            transactions: {
                select: {
                    amount: true,
                    payeeName: true,
                    id: true
                }
            }
        }
    })
}