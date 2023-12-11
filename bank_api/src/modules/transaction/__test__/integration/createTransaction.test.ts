import {test} from 'tap'
import { createFakeUser, createFakeBankAccount } from "../../../../utils/testUtils"
import buildServer from "../../../../server"
import prisma from '../../../../utils/prisma'

test('POST `/api/transactions/`', async (t) => {

    t.beforeEach(async () => {
        await prisma.transaction.deleteMany({})
        await prisma.creditCard.deleteMany({})
        await prisma.bankAccount.deleteMany({})
        await prisma.user.deleteMany({})
    })

    test('create a transaction successfully', async (t) => {

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

        const activatedCreditCard = await fastify.inject({
            method: "GET",
            url: `/api/creditcards/activation/${creditCardId}`,
            headers: {
                authorization: `Bearer ${token}`
            }
        })

        const creditCardTokenCrypted = activatedCreditCard.json().token
        // TODO - ajouter le decryptage du token et un test la dessus 
        test('the token can be decrypted', async (t) => {

        })

        test('the token cant be decrypted', async (t) => {

        })

        const createTransactionResponse = await fastify.inject({
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

        console.log(createTransactionResponse.json())
    })
    
})
