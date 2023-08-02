import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.alterTable("favourite_events",(table)=>{
        table.string("place_id").alter();
    })

}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable("favourite_events",(table)=>{
        table.integer("place_id").alter();
    })
}
