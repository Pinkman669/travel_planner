import { Knex } from "knex";
import { hashPassword } from '../hash'

export async function seed(knex: Knex): Promise<void> {
    
    await knex("events").del();
    await knex("trips").del();
    await knex("users").del();
    await knex("authorization").del();
    await knex("expenses").del();
    await knex("favourite_events").del();

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
                'active': true,
                'user_id': users[0].id,
            }
        ]).returning('*')

        await knex("events").insert([
            {
                'name': 'event-1',
                'date': new Date('10-10-2023'),
                'time': '00:00:00',
                'location': 'someplace',
                'business_hours': ["Monday: 9:00 AM - 10:00 PM",
                "Tuesday: 9:00 AM - 10:00 PM",
                "Wednesday: 9:00 AM - 10:00 PM",
                "Thursday: 9:00 AM - 10:00 PMM",
                "Friday: 9:00 AM - 10:00 PM",
                "Saturday: 9:00 AM - 10:00 PM",
                "Sunday: 9:00 AM - 10:00 PM"],
                'phone': '9876543210',
                'website': 'https://somewhere.abcdefg',
                'budget': 300,
                'trip_id': trips[0].id,
                'category': 'food',
                'item_order': 1,
                'day': 1,
                'active': true,
                'place_id': 'ChIJp8IoW4MBe0gRRX7vrejn6Ig'
            },
            {
                'name': 'event-2',
                'date': new Date('10-10-2023'),
                'time': '00:00:00',
                'location': 'someplace',
                'business_hours': ["Monday: 9:00 AM - 10:00 PM",
                "Tuesday: 9:00 AM - 10:00 PM",
                "Wednesday: 9:00 AM - 10:00 PM",
                "Thursday: 9:00 AM - 10:00 PMM",
                "Friday: 9:00 AM - 10:00 PM",
                "Saturday: 9:00 AM - 10:00 PM",
                "Sunday: 9:00 AM - 10:00 PM"],
                'phone': '9876543210',
                'website': 'https://somewhere.abcdefg',
                'budget': 300,
                'trip_id': trips[0].id,
                'category': 'food',
                'item_order': 2,
                'day': 1,
                'active': true,
                'place_id': 'ChIJxZPY38BSekgR4KXk5UeCC4s'
            },
            {
                'name': 'event-3',
                'date': new Date('10-10-2023'),
                'time': '00:00:00',
                'location': 'someplace',
                'business_hours': ["Monday: 9:00 AM - 10:00 PM",
                "Tuesday: 9:00 AM - 10:00 PM",
                "Wednesday: 9:00 AM - 10:00 PM",
                "Thursday: 9:00 AM - 10:00 PMM",
                "Friday: 9:00 AM - 10:00 PM",
                "Saturday: 9:00 AM - 10:00 PM",
                "Sunday: 9:00 AM - 10:00 PM"],
                'phone': '9876543210',
                'website': 'https://somewhere.abcdefg',
                'budget': 300,
                'trip_id': trips[0].id,
                'category': 'food',
                'item_order': 3,
                'day': 1,
                'active': true,
                'place_id': 'ChIJc3FBGy2UcEgRmHnurvD-gco'
            },
            {
                'name': 'event-4',
                'date': new Date('10-11-2023'),
                'time': '00:00:00',
                'location': 'someplace',
                'business_hours': ["Monday: 9:00 AM - 10:00 PM",
                "Tuesday: 9:00 AM - 10:00 PM",
                "Wednesday: 9:00 AM - 10:00 PM",
                "Thursday: 9:00 AM - 10:00 PMM",
                "Friday: 9:00 AM - 10:00 PM",
                "Saturday: 9:00 AM - 10:00 PM",
                "Sunday: 9:00 AM - 10:00 PM"],
                'phone': '9876543210',
                'website': 'https://somewhere.abcdefg',
                'budget': 300,
                'trip_id': trips[0].id,
                'category': 'food',
                'item_order': 1,
                'day': 2,
                'active': true,
                'place_id': 'ChIJdd4hrwug2EcRmSrV3Vo6llI'
            }
        ]);


    }
};
