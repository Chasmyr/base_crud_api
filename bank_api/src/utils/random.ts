export const getRandomCreditCardNumber = () => {
    return (Math.random()  * (9999999999999999 - 1000000000000000) + 1000000000000000).toString()
}

export const getRandomCVV = () => {
    return Math.random()  * (999 - 100) + 100
}