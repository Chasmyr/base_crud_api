import { faker } from '@faker-js/faker'

export const createFakeUser = (fakeRole: string) => {
    const firstName = faker.person.firstName()
    const lastName = faker.person.lastName()
    const password = faker.internet.password()
    const email = faker.internet.email({firstName: firstName})
    const role = fakeRole

    const user = {
        firstName: firstName,
        lastName: lastName,
        password: password,
        email: email,
        role: role
    }

    return user
}

export const createFakeBankAccount = () => {
    const balance = Math.floor(Math.random() * (10_000 - 1_000 + 1)) + 1_000
    const overdraft = -100

    const bankAccount = {
        balance,
        overdraft
    }

    return bankAccount
}