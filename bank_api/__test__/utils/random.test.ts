import { getRandomCVV, getRandomCreditCardNumber } from "../../src/utils/random"

describe('generate a random credit card number', () => {

    it('should generate a random string', () => {
        const string1 = getRandomCreditCardNumber()
        const string2 = getRandomCreditCardNumber()

        expect(string1).not.toEqual(string2)
    })

    it('should generate a string with 16 char', () => {
        const string = getRandomCreditCardNumber()
        expect(string.length).toBe(16)
    })
})

describe('generate a random CVV', () => {

    it('should generate a random number', () => {
        const number1 = getRandomCVV()
        const number2 = getRandomCVV()

        expect(number1).not.toEqual(number2)
    })

    it('should generate a number between 100 and 999', () => {
        const number = getRandomCVV()
        expect(number).toBeGreaterThan(100)
        expect(number).toBeLessThan(999)
    })
})