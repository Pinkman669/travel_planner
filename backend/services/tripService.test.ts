import Knex from "knex";
import { TripService } from "./tripService";

const knexConfig = require('../knexfile')
const knex = Knex(knexConfig['test'])

describe('tripService', () => {
    let tripService: TripService
    let testUser: {
        id: number
    }
    let testTripId: number

    beforeEach(async () => {
        tripService = new TripService(knex)

    })

    beforeAll(async () => {
        testUser = (await knex.insert({
            'name': 'test_user',
            'email': 'test_user@gmail.com',
            'password': 'test_user@gmail.com',
            'birthday': new Date('10-10-1990')
        })
            .into('users')
            .returning('id'))[0]

        testTripId = (await knex.insert({
            'name': 'test_trip',
            'location': 'test_location',
            'start_date': new Date('10-10-1990'),
            'end_date': new Date('10-12-1990'),
            'user_id': testUser.id,
            'active': true
        })
            .into('trips')
            .returning('id'))[0].id
    })

    it('should add trip', async () => {
        await tripService.addTrip('add_trip', 'add_location', new Date('10-10-1990'), new Date('10-12-1990'), testUser.id)

        const addedTrip = (await knex
            .select('*')
            .from('trips')
            .where('user_id', testUser.id)
            .andWhere('name', 'add_trip'))[0]

        expect(addedTrip).toMatchObject({
            'name': 'add_trip',
            'location': 'add_location',
            'start_date': new Date('10-10-1990'),
            'end_date': new Date('10-12-1990'),
            'user_id': testUser.id,
            'active': true
        })
    })

    it('should get trip', async () => {
        const addedTrip = await tripService.getTrip(testUser.id)

        expect(addedTrip.length).toBe(1)
        expect(addedTrip[0].id).toBe(testTripId)
    })

    afterEach(async () => {
        await knex.delete()
            .from('trips')
            .where('name', 'add_trip')
    })

    afterAll(async () => {
        await knex.delete()
            .from('trips')
            .where('name', 'test_trip')
        await knex.delete()
            .from('users')
            .where('id', testUser.id)

        knex.destroy()
    })
})
