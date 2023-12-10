import {test} from 'tap'
import { createFakeUser } from "../../../../utils/testUtils"
import buildServer from "../../../../server"
import prisma from '../../../../utils/prisma'

test('DELETE `/api/users/:id`', async (t) => {

    t.beforeEach(async () => {
        await prisma.user.deleteMany({})
    })

    test('delete a user successfully', async (t) => {

        const user = createFakeUser('client')

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

        const loginResponse = await fastify.inject({
            method: "POST",
            url: '/api/users/login',
            payload: {
                email: user.email,
                password: user.password
            }
        })

        const id = createUserResponse.json().id

        const token = loginResponse.json().accessToken

        const response = await fastify.inject({
            method: 'DELETE',
            url: `/api/users/${id}`,
            headers: {
                authorization: `Bearer ${token}`
            }
        })

        t.equal(response.statusCode, 200)
    })

    test('fail to delete because the role or the id is incorrect', async (t) => {
        const user = createFakeUser('client')
        const employeeUser = createFakeUser('employee')

        const fastify = buildServer()

        t.teardown(async () => {
            fastify.close()
        })

        const createClientUserResponse = await fastify.inject({
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
                email: employeeUser.email,
                password: employeeUser.password,
                firstName: employeeUser.firstName,
                lastName: employeeUser.lastName,
                role: employeeUser.role
            }
        })

        const loginResponse = await fastify.inject({
            method: "POST",
            url: '/api/users/login',
            payload: {
                email: employeeUser.email,
                password: employeeUser.password
            }
        })

        const id = createClientUserResponse.json().id

        const token = loginResponse.json().accessToken

        const response = await fastify.inject({
            method: 'DELETE',
            url: `/api/users/${id}`,
            headers: {
                authorization: `Bearer ${token}`
            }
        })

        t.equal(response.statusCode, 401)
    })

    test('fail to delete a user because the user dont exist', async (t) => {
        const adminUser = createFakeUser('admin')

        const fastify = buildServer()

        t.teardown(async () => {
            fastify.close()
        })

        const createAdminUserResponse = await fastify.inject({
            method: "POST",
            url: '/api/users',
            payload: {
                email: adminUser.email,
                password: adminUser.password,
                firstName: adminUser.firstName,
                lastName: adminUser.lastName,
                role: adminUser.role
            }
        })

        const loginResponse = await fastify.inject({
            method: "POST",
            url: '/api/users/login',
            payload: {
                email: adminUser.email,
                password: adminUser.password
            }
        })

        const id = 0

        const token = loginResponse.json().accessToken

        const response = await fastify.inject({
            method: 'DELETE',
            url: `/api/users/${id}`,
            headers: {
                authorization: `Bearer ${token}`
            }
        })

        t.equal(response.statusCode, 404)
        t.equal(response.json().error, 'User not found')
    })
})