import {test} from 'tap'
import { createFakeUser } from "../../../../utils/testUtils"
import buildServer from "../../../../server"
import prisma from '../../../../utils/prisma'

test('GET `/api/users/`', async (t) => {

    t.beforeEach(async () => {
        await prisma.user.deleteMany({})
    })

    test('get all users successfully', async (t) => {
        const user = createFakeUser('client')
        const user2 = createFakeUser('client')

        const fastify = buildServer()

        t.teardown(async () => {
            fastify.close()
        })

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

        // 'x-prisma-client': 'db-test',

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

        const loginResponse = await fastify.inject({
            method: "POST",
            url: '/api/users/login',
            payload: {
                email: user.email,
                password: user.password
            }
        })

        const token = loginResponse.json().accessToken

        const response = await fastify.inject({
            method: 'GET',
            url: `/api/users`,
            headers: {
                authorization: `Bearer ${token}`
            }
        })

        const id = createUserResponse.json().id
        const id2 = createUser2Response.json().id

        const toMatch = [
            {email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role, id: id},
            {email: user2.email, firstName: user2.firstName, lastName: user2.lastName, role: user2.role, id: id2}
        ]

        const json = response.json()
        // TODO - fix l'égalité 
        // t.equal(json, toMatch)
    })
})