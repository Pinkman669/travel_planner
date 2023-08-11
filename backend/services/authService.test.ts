import Knex from "knex";
import { AuthService } from "./authService";


const knexConfig = require('../knexfile')
export const knex = Knex(knexConfig['test'])

describe('authService', () => {
    let authService: AuthService

    beforeEach(async () => {
        authService = new AuthService(knex)

        const isTestUserExist = await authService.userInfo('test_user@gmail.com')
        if (!isTestUserExist) {
            await knex.insert({
                'name': 'test_user',
                'email': 'test_user@gmail.com',
                'password': 'test_user@gmail.com',
                'birthday': new Date('10-10-1990')
            })
                .into('users')
                .returning('*')
        }
    })

    xit('should get userInfo', async () => {
        const userInfo = await authService.userInfo('test_user@gmail.com')

        expect(userInfo).toMatchObject({
            'name': 'test_user',
            'email': 'test_user@gmail.com',
            'password': 'test_user@gmail.com',
            'birthday': new Date('10-10-1990')
        })
    })

    xit('should sign up', async () => {
        const jest_testUser = await authService.signUp(
            'jest_test',
            'jest_test@gmail.com',
            'jest_test@gmail.com',
            new Date('10-10-1990')
        )

        const isJestTestUserExist = (await knex
            .select('email', 'name', 'password', 'birthday')
            .from('users')
            .where('email', 'jest_test@gmail.com'))[0]

        expect(jest_testUser).toMatchObject(isJestTestUserExist)
    })

    afterAll(() => {
        knex.destroy()
    })
})