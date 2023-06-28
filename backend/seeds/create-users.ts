import { Knex } from "knex";
import { hashPassword } from '../hash'

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex("users").del();

    // Inserts seed entries
    await knex("users").insert([
        {
            'email': 'test@gmail.com',
            'name': 'test',
            'birthday': new Date('December 17, 1995'),
            'password': await hashPassword('test@gmail.com')
        }
    ]);
};
