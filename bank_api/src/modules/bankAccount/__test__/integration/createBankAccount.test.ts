import {test} from 'tap'
import { createFakeUser, createFakeBankAccount } from "../../../../utils/testUtils"
import buildServer from "../../../../server"
import prisma from '../../../../utils/prisma'

test('POST `/api/bankaccounts/:id`', async (t) => {

    t.beforeEach(async () => {
        await prisma.bankAccount.deleteMany({})
        await prisma.user.deleteMany({})
    })

    test('create bank account successfully', async (t) => {
        // créer un user
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

        // test le status code
        t.equal(createBankAccountResponse.statusCode, 201)
        const json = createBankAccountResponse.json()
        t.equal(json.balance, balance)
        t.equal(json.overdraft, overdraft)
    })
    
    test('fail to create bank account because the user is not found', async (t) => {
        // créer un user
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
            url: `/api/bankaccounts/0`,
            payload: {
                balance,
                overdraft
            },
            headers: {
                authorization: `Bearer ${token}`
            }
        })

        // test le status code
        t.equal(createBankAccountResponse.statusCode, 500)
    })

    test('fail to create bank account because the role is incorrect', async (t) => {
        // créer un user
        const user = createFakeUser('client')
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
        // test le status code
        t.equal(createBankAccountResponse.statusCode, 401)
    })
})
