import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.alterTable("events", (table) => {
        table.string("business_hours", 500).alter();
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable("events", (table) => {
        table.string("business_hours").alter();
    })
}

