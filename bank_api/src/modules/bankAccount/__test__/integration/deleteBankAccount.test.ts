import {test} from 'tap'
import { createFakeUser, createFakeBankAccount } from "../../../../utils/testUtils"
import buildServer from "../../../../server"
import prisma from '../../../../utils/prisma'

test('DELETE `/api/bankaccounts/:id`', async (t) => {

    t.beforeEach(async () => {
        await prisma.bankAccount.deleteMany({})
        await prisma.user.deleteMany({})
    })

    test('delete bank account successfully', async (t) => {
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

        const deleteBankAccountResponse = await fastify.inject({
            method: "DELETE",
            url: `/api/bankaccounts/${bankAccountId}`,
            headers: {
                authorization: `Bearer ${token}`
            }
        })


        // test le status code
        t.equal(deleteBankAccountResponse.statusCode, 200)
    })
    
    test('fail to delete bank account because the bank account is not found', async (t) => {
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

       const deleteBankAccountResponse = await fastify.inject({
           method: "DELETE",
           url: `/api/bankaccounts/0`,
           headers: {
               authorization: `Bearer ${token}`
           }
       })


       // test le status code
       t.equal(deleteBankAccountResponse.statusCode, 404)
    })

    test('fail to delete bank account because the role is incorrect', async (t) => {
        // créer un user
        const user = createFakeUser('client')
        const user2 = createFakeUser('admin')
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
        const createUser2Response = await fastify.inject({
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

        // s'authentifier
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
        const token2 = loginResponse.json().accessToken

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

        const deleteBankAccountResponse = await fastify.inject({
            method: "DELETE",
            url: `/api/bankaccounts/${bankAccountId}`,
            headers: {
                authorization: `Bearer ${token2}`
            }
        })
        // test le status code
        t.equal(createBankAccountResponse.statusCode, 401)
    })
})
