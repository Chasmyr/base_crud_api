import {test} from 'tap'
import { faker } from '@faker-js/faker'
import buildServer from '../../../../server'
import { ImportMock } from 'ts-mock-imports'
import * as userService from '../../user.service'
import prisma from '../../../../utils/prisma'
import { createFakeUser } from '../../../../utils/testUtils'

test('POST `/api/users`', async (t) => {

    t.beforeEach(async () => {
        await prisma.user.deleteMany({})
    })

    test('create user successfully with mock createUser', async (t) => {
    
        const user = createFakeUser('client')
        const id = Math.floor(Math.random() * 1000)
    
        const fastify = buildServer()
    
        const stub = ImportMock.mockFunction(userService, 'createUser', {
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            id
        })
    
        t.teardown(() => {
            fastify.close()
            stub.restore()
        })
    
        const response = await fastify.inject({
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
    
        t.equal(response.statusCode, 201)
        t.equal(response.headers['content-type'], "application/json; charset=utf-8")
        
        const json = response.json()
    
        t.equal(json.email, user.email)
        t.equal(json.firstName, user.firstName)
        t.equal(json.lastName, user.lastName)
        t.equal(json.role, user.role)
        t.equal(json.id, id)
    })
    
    test('create user successfully with test database', async (t) => {
        
        const user = createFakeUser('client')
    
        const fastify = buildServer()
    
        t.teardown(async () => {
            fastify.close()
        })
    
        const response = await fastify.inject({
            method: "POST",
            url: '/api/users',
            payload: {
                password: user.password,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                email: user.email
            }
        })
    
        t.equal(response.statusCode, 201)
        t.equal(response.headers['content-type'], "application/json; charset=utf-8")
        
        const json = response.json()
    
        t.equal(json.email, user.email)
        t.equal(json.firstName, user.firstName)
        t.equal(json.lastName, user.lastName)
        t.equal(json.role, user.role)
        t.type(json.id, "number")
    })
    
    test('fail to create a user', async (t) => {
        
        const firstName = faker.person.firstName()
        const lastName = faker.person.lastName()
        const password = faker.internet.password()
        const role = 'client'
    
        const fastify = buildServer()
    
        t.teardown(async () => {
            fastify.close()
        })
    
        const response = await fastify.inject({
            method: "POST",
            url: '/api/users',
            payload: {
                password,
                firstName,
                lastName,
                role
            }
        })
    
        t.equal(response.statusCode, 400)
        
        const json = response.json()
    
        t.equal(json.message, "body must have required property 'email'")
    })
})
