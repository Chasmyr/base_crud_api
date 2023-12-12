import {test} from 'tap'
import { createFakeUser, createFakeBankAccount } from "../../../../utils/testUtils"
import buildServer from "../../../../server"
import prisma from '../../../../utils/prisma'

test('GET `/api/transactions/bankaccount/:id`', async (t) => {

    t.beforeEach(async () => {
        await prisma.transaction.deleteMany({})
        await prisma.creditCard.deleteMany({})
        await prisma.bankAccount.deleteMany({})
        await prisma.user.deleteMany({})
    })

    test('get all transactions from bank account successfully', async (t) => {

        const user = createFakeUser('admin')
        const fastify = buildServer()
        t.teardown(() => fastify.close())

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

        const activatedCreditCard = await fastify.inject({
            method: "GET",
            url: `/api/creditcards/activation/${creditCardId}`,
            headers: {
                authorization: `Bearer ${token}`
            }
        })

        const creditCardTokenCrypted = activatedCreditCard.json().token

        const transactionsResponse = await fastify.inject({
            method: "POST",
            url: `/api/transactions/`,
            payload: {
                payeeName: 'test',
                payeeId: 'khahrbarjohao',
                amount: 2.6
            },
            headers: {
                authorization: `Bearer ${creditCardTokenCrypted}`
            }
        })

        const getAllFromBank = await fastify.inject({
            method: "GET",
            url: `/api/transactions/bankaccount/${accountId}`,
            headers: {
                authorization: `Bearer ${token}`
            }
        })

        t.equal(getAllFromBank.statusCode, 200)
    })

    test('fail to get all transactions from bank account because the bank account is not found', async (t) => {

        
        const user = createFakeUser('admin')
        const fastify = buildServer()
        t.teardown(() => fastify.close())

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

        const loginResponse = await fastify.inject({
            method: "POST",
            url: '/api/users/login',
            payload: {
                email: user.email,
                password: user.password
            }
        })

        const token = loginResponse.json().accessToken

        const getAllFromCredit = await fastify.inject({
            method: "GET",
            url: `/api/transactions/card/0`,
            headers: {
                authorization: `Bearer ${token}`
            }
        })

        t.equal(getAllFromCredit.statusCode, 404)
    })

    test('fail to get all transactions from bank account because user id or the role is incorrect', async (t) => {

        const user = createFakeUser('admin')
        const user2 = createFakeUser('client')
        const fastify = buildServer()
        t.teardown(() => fastify.close())

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
        const createUserResponse2 = await fastify.inject({
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

        const activatedCreditCard = await fastify.inject({
            method: "GET",
            url: `/api/creditcards/activation/${creditCardId}`,
            headers: {
                authorization: `Bearer ${token}`
            }
        })

        const creditCardTokenCrypted = activatedCreditCard.json().token

        const transactionsResponse = await fastify.inject({
            method: "POST",
            url: `/api/transactions/`,
            payload: {
                payeeName: 'test',
                payeeId: 'khahrbarjohao',
                amount: 2.6
            },
            headers: {
                authorization: `Bearer ${creditCardTokenCrypted}`
            }
        })

        const getAllFromCredit = await fastify.inject({
            method: "GET",
            url: `/api/transactions/card/${creditCardId}`,
            headers: {
                authorization: `Bearer ${token2}`
            }
        })

        t.equal(getAllFromCredit.statusCode, 401)
    })
    
})
