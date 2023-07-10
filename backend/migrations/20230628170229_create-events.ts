import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('events', (table) =>{
        table.increments()
        table.string('name')
        table.date('date')
        table.time('time')
        table.string('location')
        table.string('business_hours')
        table.string('phone')
        table.string('website')
        table.integer('budget')
        table.integer('expense')
        table.integer('trip_id')
        table.string('category')
        table.integer('item_order')
        table.integer('day')
        table.foreign('trip_id').references('trips.id')
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('events')
}

