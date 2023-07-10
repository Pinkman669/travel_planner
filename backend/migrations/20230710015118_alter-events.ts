import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.alterTable("events", (table) => {
        table.boolean("active");
        table.string("place_id");
      });
    }


export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable("events", (table) => {
        table.dropColumn('active');
        table.dropColumn('place_id');
      });
}

