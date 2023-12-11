import {test} from 'tap'
import { createFakeUser, createFakeBankAccount } from "../../../../utils/testUtils"
import buildServer from "../../../../server"
import prisma from '../../../../utils/prisma'

test('GET `/api/creditcards/desactivation/:id`', async (t) => {

    t.beforeEach(async () => {
        await prisma.creditCard.deleteMany({})
        await prisma.bankAccount.deleteMany({})
        await prisma.user.deleteMany({})
    })

    test('desactivate a credit card successfully', async (t) => {

        const user = createFakeUser('admin')
        const fastify = buildServer()

        const createUserResponse = await fastify.inject({
            method: "POST",
            url: '/api/users',
            payload: {
                email: user.email,
                password: user.password,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role
            }
        })
        const userId = createUserResponse.json().id

        const loginResponse = await fastify.inject({
            method: "POST",
            url: '/api/users/login',
            payload: {
                email: user.email,
                password: user.password
            }
        })

        const token = loginResponse.json().accessToken

        const {balance, overdraft} = createFakeBankAccount()
        const createBankAccountResponse = await fastify.inject({
            method: "POST",
            url: `/api/bankaccounts/${userId}`,
            payload: {
                balance,
                overdraft
            },
            headers: {
                authorization: `Bearer ${token}`
            }
        })

        const accountId = createBankAccountResponse.json().id

        // test le status code
        const createCreditCardResponse = await fastify.inject({
            method: "POST",
            url: `/api/creditcards/${accountId}`,
            payload: {
                expiration: '09/28'
            },
            headers: {
                authorization: `Bearer ${token}`
            }
        })

        const creditCardId = createCreditCardResponse.json().id 

        const desactivateCreditCard = await fastify.inject({
            method: "GET",
            url: `/api/creditcards/desactivation/${creditCardId}`,
            headers: {
                authorization: `Bearer ${token}`
            }
        })

        t.equal(desactivateCreditCard.statusCode, 200)
    })

    test('fail to desactivate a credit card because the credit card is not found', async (t) => {

        const user = createFakeUser('admin')
        const fastify = buildServer()

        const createUserResponse = await fastify.inject({
            method: "POST",
            url: '/api/users',
            payload: {
                email: user.email,
                password: user.password,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role
            }
        })
        const userId = createUserResponse.json().id

        const loginResponse = await fastify.inject({
            method: "POST",
            url: '/api/users/login',
            payload: {
                email: user.email,
                password: user.password
            }
        })

        const token = loginResponse.json().accessToken

        const {balance, overdraft} = createFakeBankAccount()
        const createBankAccountResponse = await fastify.inject({
            method: "POST",
            url: `/api/bankaccounts/${userId}`,
            payload: {
                balance,
                overdraft
            },
            headers: {
                authorization: `Bearer ${token}`
            }
        })

        const accountId = createBankAccountResponse.json().id

        // test le status code
        const createCreditCardResponse = await fastify.inject({
            method: "POST",
            url: `/api/creditcards/${accountId}`,
            payload: {
                expiration: '09/28'
            },
            headers: {
                authorization: `Bearer ${token}`
            }
        })

        const desactivateCreditCard = await fastify.inject({
            method: "GET",
            url: `/api/creditcards/desactivation/0`,
            headers: {
                authorization: `Bearer ${token}`
            }
        })

        t.equal(desactivateCreditCard.statusCode, 404)
    })

    test('fail to desactivate a credit card because the role is incorrect', async (t) => {

        const user = createFakeUser('admin')
        const user2 = createFakeUser('client')
        const fastify = buildServer()

        const createUserResponse = await fastify.inject({
            method: "POST",
            url: '/api/users',
            payload: {
                email: user.email,
                password: user.password,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role
            }
        })
        await fastify.inject({
            method: "POST",
            url: '/api/users',
            payload: {
                email: user2.email,
                password: user2.password,
                firstName: user2.firstName,
                lastName: user2.lastName,
                role: user2.role
            }
        })
        const userId = createUserResponse.json().id

        const loginResponse = await fastify.inject({
            method: "POST",
            url: '/api/users/login',
            payload: {
                email: user.email,
                password: user.password
            }
        })

        const loginResponse2 = await fastify.inject({
            method: "POST",
            url: '/api/users/login',
            payload: {
                email: user2.email,
                password: user2.password
            }
        })

        const token = loginResponse.json().accessToken
        const token2 = loginResponse2.json().accessToken

        const {balance, overdraft} = createFakeBankAccount()
        const createBankAccountResponse = await fastify.inject({
            method: "POST",
            url: `/api/bankaccounts/${userId}`,
            payload: {
                balance,
                overdraft
            },
            headers: {
                authorization: `Bearer ${token}`
            }
        })

        const accountId = createBankAccountResponse.json().id

        // test le status code
        const createCreditCardResponse = await fastify.inject({
            method: "POST",
            url: `/api/creditcards/${accountId}`,
            payload: {
                expiration: '09/28'
            },
            headers: {
                authorization: `Bearer ${token}`
            }
        })

        const creditCardId = createCreditCardResponse.json().id 

        const desactivateCreditCard = await fastify.inject({
            method: "GET",
            url: `/api/creditcards/desactivation/${creditCardId}`,
            headers: {
                authorization: `Bearer ${token2}`
            }
        })

        t.equal(desactivateCreditCard.statusCode, 401)
    })
    
})
