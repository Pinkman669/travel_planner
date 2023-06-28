import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('trips', (table)=>{
        table.increments()
        table.string('name')
        table.date('start_date')
        table.date('end_date')
        table.string('location')
        table.integer('user_id')
        table.foreign('user_id').references('users.id')
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('trips')
}

