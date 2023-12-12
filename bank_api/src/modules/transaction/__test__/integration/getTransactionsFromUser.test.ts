import {test} from 'tap'
import { createFakeUser, createFakeBankAccount } from "../../../../utils/testUtils"
import buildServer from "../../../../server"
import prisma from '../../../../utils/prisma'

test('GET `/api/transactions/`', async (t) => {

    t.beforeEach(async () => {
        await prisma.transaction.deleteMany({})
        await prisma.creditCard.deleteMany({})
        await prisma.bankAccount.deleteMany({})
        await prisma.user.deleteMany({})
    })

    test('get all transactions from user successfully', async (t) => {

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

        const getAllFromUser = await fastify.inject({
            method: "GET",
            url: `/api/transactions/`,
            headers: {
                authorization: `Bearer ${token}`
            }
        })

        t.equal(getAllFromUser.statusCode, 200)
    })

    test('fail to get all transactions from user because the token is incorrect', async (t) => {

        
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

        const getAllFromUser = await fastify.inject({
            method: "GET",
            url: `/api/transactions/`,
        })

        t.equal(getAllFromUser.statusCode, 401)
    })
    
})
