import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('users', (table)=>{
        table.increments()
        table.string('email')
        table.string('name')
        table.date('birthday')
        table.string('password')
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('users')
}

