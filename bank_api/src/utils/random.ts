import { creditCardGeneratorMax, creditCardGeneratorMin, cvvGeneratorMax, cvvGeneratorMin } from "./const"

export const getRandomCreditCardNumber = () => {
    return Math.floor((Math.random()  * (creditCardGeneratorMax - creditCardGeneratorMin) + creditCardGeneratorMin)).toString()
}

export const getRandomCVV = () => {
    return Math.floor(Math.random()  * (cvvGeneratorMax - cvvGeneratorMin) + cvvGeneratorMin)
}