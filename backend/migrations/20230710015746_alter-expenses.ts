import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.alterTable("expenses",(table)=>{
        table.boolean("active");
    })
}


export async function down(knex: Knex): Promise<void> {
    // await knex.schema.alterTable("expenses",(table)=>{
    //     table.dropColumn("active");
    // })
}

