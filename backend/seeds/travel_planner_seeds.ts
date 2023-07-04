import { Knex } from "knex";
import { hashPassword } from '../hash'

export async function seed(knex: Knex): Promise<void> {
    // Inserts seed entries
    let users = await knex.select('*').from('users').where('email', 'test@gmail.com')
    if (users.length === 0) {
        users = (await knex("users").insert([
            {
                'email': 'test@gmail.com',
                'name': 'test',
                'birthday': new Date('December 17, 1995'),
                'password': await hashPassword('test@gmail.com')
            }
        ]).returning('*'))

        const trips = await knex("trips").insert([
            {
                'name': 'Japan-trip-2023',
                'start_date': new Date('10-10-2023'),
                'end_date': new Date('10-13-2023'),
                'location': 'Japan',
                'user_id': users[0].id,
            }
        ]).returning('*')

        await knex("events").insert([
            {
                'name': '123',
                'date': new Date('10-10-2023'),
                'time': '00:00:00',
                'location': 'someplace',
                'business_hours': '0900-1800',
                'phone': '9876543210',
                'website': 'https://somewhere.abcdefg',
                'budget': 300,
                'trip_id': trips[0].id,
                'category': 'food',
                'order': 1,
                'day': 1,
            }
        ]);


    }
};
