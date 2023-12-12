import {test} from 'tap'
import { createFakeUser, createFakeBankAccount } from "../../../../utils/testUtils"
import buildServer from "../../../../server"
import prisma from '../../../../utils/prisma'

test('PUT `/api/bankaccounts/:id`', async (t) => {

    t.beforeEach(async () => {
        await prisma.bankAccount.deleteMany({})
        await prisma.user.deleteMany({})
    })

    test('update bank account successfully', async (t) => {
        // créer un user
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

        // s'authentifier
        const loginResponse = await fastify.inject({
            method: "POST",
            url: '/api/users/login',
            payload: {
                email: user.email,
                password: user.password
            }
        })

        const token = loginResponse.json().accessToken

        // lui aussi un bank account
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

        const bankAccountId = createBankAccountResponse.json().id
        const newBalance = 12868618638618

        const updateBankAccountResponse = await fastify.inject({
            method: "PUT",
            url: `/api/bankaccounts/${bankAccountId}`,
            payload: {
                balance: newBalance
            },
            headers: {
                authorization: `Bearer ${token}`
            }
        })

        // test le status code
        t.equal(updateBankAccountResponse.statusCode, 200)
        const json = updateBankAccountResponse.json()
        t.equal(json.balance, newBalance)
    })
    
    test('fail to upate bank account because the bank account is not found', async (t) => {

        const user = createFakeUser('admin')
        const fastify = buildServer()

        await fastify.inject({
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

        const {balance, overdraft} = createFakeBankAccount()
        const createBankAccountResponse = await fastify.inject({
            method: "POST",
            url: `/api/bankaccounts/0`,
            payload: {
                balance,
                overdraft
            },
            headers: {
                authorization: `Bearer ${token}`
            }
        })

        const updateBankAccountResponse = await fastify.inject({
            method: "PUT",
            url: `/api/bankaccounts/0`,
            payload: {
                balance: 1816
            },
            headers: {
                authorization: `Bearer ${token}`
            }
        })
        // test le status code
        t.equal(updateBankAccountResponse.statusCode, 404)
    })

    test('fail to create bank account because the role is incorrect', async (t) => {

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

        const userId = createUserResponse.json().id

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

        const bankAccountId = createBankAccountResponse.json().id
        const newBalance = 12868618638618

        const updateBankAccountResponse = await fastify.inject({
            method: "PUT",
            url: `/api/bankaccounts/${bankAccountId}`,
            payload: {
                balance: newBalance
            },
            headers: {
                authorization: `Bearer ${token2}`
            }
        })
        // test le status code
        t.equal(updateBankAccountResponse.statusCode, 401)
    })
})
