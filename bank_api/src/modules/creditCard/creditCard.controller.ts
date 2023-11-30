import { FastifyRequest } from "fastify";
import { AuthCreditCardInput, CreateCreditCardInput } from "./creditCard.schema";
import { createCreditCard, creditCardActivation, getCreditCards } from "./creditCard.service";

export async function createCreditCardHandler(request: FastifyRequest<{
    Body: CreateCreditCardInput
}>) {
    const creditCard = await createCreditCard({
        ...request.body
    })

    return creditCard
}

export async function creditCardActivationHandler(request: FastifyRequest<{
    Body: AuthCreditCardInput
}>) {
    const creditCard = await creditCardActivation({
        ...request.body
    })

    return creditCard
}

export async function getCreditCardsHandler() {
    const creditCards = await getCreditCards()

    return creditCards
}