import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.alterTable("events", (table) => {
        table.string("time").alter();
      });
    }



export async function down(knex: Knex): Promise<void> {
    // await knex.schema.alterTable("events", (table) => {
    //     table.time("time").alter();
    //   });
}

