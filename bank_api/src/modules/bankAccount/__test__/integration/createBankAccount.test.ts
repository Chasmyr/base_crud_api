import {test} from 'tap'
import { createFakeUser } from "../../../../utils/testUtils"
import buildServer from "../../../../server"
import prisma from '../../../../utils/prisma'

test('POST `/api/bankaccounts`', async (t) => {

    t.beforeEach(async () => {
        await prisma.user.deleteMany({})
    })

    test('create bank account successfully', async (t) => {
        // créer un user

        // s'authentifier

        // lui aussi un bank account

        // test le status code
    })
    
    test('fail to create bank account because the role or the id is incorrect', async (t) => {
        // créer deux user 

        // s'authentifier

        // faire la requete avec le mauvais jwt

        // test le status code
    })
})
