import {test} from 'tap'
import { createFakeUser, createFakeBankAccount } from "../../../../utils/testUtils"
import buildServer from "../../../../server"
import prisma from '../../../../utils/prisma'

test('GET `/api/bankaccounts/`', async (t) => {

    t.beforeEach(async () => {
        await prisma.bankAccount.deleteMany({})
        await prisma.user.deleteMany({})
    })

    test('get all bank account successfully', async (t) => {
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
        const {balance: balance2, overdraft: overdraft2} = createFakeBankAccount()
        await fastify.inject({
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
        await fastify.inject({
            method: "POST",
            url: `/api/bankaccounts/${userId}`,
            payload: {
                balance: balance2,
                overdraft: overdraft2
            },
            headers: {
                authorization: `Bearer ${token}`
            }
        })

        // test le status code et l'agalité
        const getAllResponse = await fastify.inject({
            method: "GET",
            url: `/api/bankaccounts/`,
        })
        const getAllResponse2 = await fastify.inject({
            method: "GET",
            url: `/api/bankaccounts/`,
        })

        t.equal(getAllResponse.statusCode, 200)
        t.equal(getAllResponse2.statusCode, 200)
    })
    
})
