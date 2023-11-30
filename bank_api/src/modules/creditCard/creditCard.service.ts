import prisma from "../../utils/prisma";
import { getRandomCVV, getRandomCreditCardNumber } from "../../utils/random";
import { AuthCreditCardInput, CreateCreditCardInput } from "./creditCard.schema";

export async function createCreditCard(input: CreateCreditCardInput){

    const {expiration, accountId} = input

    const creditCardNumber = getRandomCreditCardNumber()
    const cvv = getRandomCVV()

    const creditCard = await prisma.creditCard.create({
        data: {expiration, creditCardNumber, cvv, accountId}
    })

    return creditCard
}

export async function creditCardActivation(input: AuthCreditCardInput) {

    const {id} = input
    
    const creditCard = await prisma.creditCard.findUnique({
        where: {
            id
        }
    })

    if(creditCard.token === "" && !creditCard.isActive) {
        // activer la carte et générer le token
    } else if (creditCard.token !== "" && creditCard.isActive) {
        // code pour désactiver la carte 
    } else {
        // renvoie une erreur pour dire que la carte a été désactivée
    }
}

export async function getCreditCards() {
    return await prisma.creditCard.findMany({
        select: {
            creditCardNumber: true,
            expiration: true,
            cvv: true,
            isActive: true,
            id: true,
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