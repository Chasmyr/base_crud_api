import { compareDateForCreditCard } from "../../src/utils/date"

describe('compare expiration date and current date', () => {
    
    it('should return true when the current date is before expiration', () => {
        const currentDate = new Date(2022, 0, 1)
        const expirationDate = "08/23"

        const result = compareDateForCreditCard(currentDate, expirationDate)

        expect(result).toBe(true)
    })

    it('should return false when the current date is after expiration', () => {
        const currentDate = new Date(2022, 0, 1)
        const expirationDate = "08/21"

        const result = compareDateForCreditCard(currentDate, expirationDate)

        expect(result).toBe(false)
    })

    it('should return true when the current date equal the expiration date', () => {
        const currentDate = "08/12"
        const parts = currentDate.split('/');
        const month2 = parseInt(parts[0], 10) - 1 // Soustraire 1 car les mois dans les objets Date commencent à 0
        const year2 = parseInt(parts[1], 10) + 2000 // Ajouter 2000 pour les années à deux chiffres
        const nextMonth = new Date(year2, month2 + 1, 1)
        const currentDateTransformed = new Date((nextMonth as any) - 1)

        const expirationDate = "08/12"

        const result = compareDateForCreditCard(currentDateTransformed, expirationDate)

        expect(result).toBe(true)
    })
})