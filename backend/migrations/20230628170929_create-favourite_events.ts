import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('favourite_events', (table) =>{
        table.increments()
        table.string('name')
        table.string('address')
        table.string('business_hours')
        table.string('phone')
        table.string('website')
        table.integer('trip_id')
        table.integer('user_id')
        table.foreign('user_id').references('users.id')
        table.foreign('trip_id').references('trips.id')
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('favourite_events')
}

