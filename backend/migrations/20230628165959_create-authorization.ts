import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('authorization', (table) =>{
        table.increments()
        table.integer('user_id')
        table.integer('authorization')
        table.integer('trip_id')
        table.foreign('user_id').references('users.id')
        table.foreign('trip_id').references('trips.id')
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('authorization')
}

