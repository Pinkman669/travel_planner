import { Knex } from "knex";
import { hashPassword } from '../hash'

export async function seed(knex: Knex): Promise<void> {
    // Inserts seed entries
    const users = await knex.select('*').from('users').where('email', 'test@gmail.com')
    if (users.length === 0){
        await knex("users").insert([
            {
                'email': 'test@gmail.com',
                'name': 'test',
                'birthday': new Date('December 17, 1995'),
                'password': await hashPassword('test@gmail.com')
            }
        ]);
    }
};
