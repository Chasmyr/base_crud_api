import {test} from 'tap'
import buildServer from '../../../../server'
import { createFakeUser } from '../../../../utils/testUtils'
import prisma from '../../../../utils/prisma'

test('Post `/api/users/login`', async (t) => {

    t.beforeEach(async () => {
        await prisma.user.deleteMany({})
    })

    test('given the email and password are correct', async (t) => {

        const user = createFakeUser('client')

        const fastify = buildServer()

        t.teardown(async () => {
            fastify.close()
        })

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

        const response = await fastify.inject({
            method: "POST",
            url: '/api/users/login',
            payload: {
                email: user.email,
                password: user.password
            }
        })

        t.equal(response.statusCode, 200)

        const verified = fastify.jwt.verify(response.json().accessToken)

        t.equal(verified.email, user.email)
        t.equal(verified.firstName, user.firstName)
        t.equal(verified.lastName, user.lastName)
        t.equal(verified.role, user.role)
        t.type(verified.id, "number")
        t.type(verified.iat, "number")
    })

    test('given the email is not correct', async (t) => {

        const user = createFakeUser('client')

        const fastify = buildServer()

        t.teardown(async () => {
            fastify.close()
        })

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

        const response = await fastify.inject({
            method: "POST",
            url: '/api/users/login',
            payload: {
                email: 'wrong@email.com',
                password: user.password
            }
        })

        t.equal(response.statusCode, 401)

        const json = response.json()

        t.equal(json.message, 'Invalid email or password')
    })

    test('given the password is not correct', async (t) => {

        const user = createFakeUser('client')

        const fastify = buildServer()

        t.teardown(async () => {
            fastify.close()
        })

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

        const response = await fastify.inject({
            method: "POST",
            url: '/api/users/login',
            payload: {
                email: user.email,
                password: ''
            }
        })

        t.equal(response.statusCode, 401)

        const json = response.json()

        t.equal(json.message, 'Invalid email or password')
    })

})