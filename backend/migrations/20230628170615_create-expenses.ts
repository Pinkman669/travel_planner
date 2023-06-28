import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('expenses', (table) =>{
        table.increments()
        table.integer('event')
        table.string('category')
        table.integer('expense')
        table.integer('event_id')
        table.integer('trip_id')
        table.foreign('event_id').references('events.id')
        table.foreign('trip_id').references('trips.id')
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('expenses')
}

