import type { Knex } from "knex";
import dotenv from 'dotenv'
dotenv.config()
// Update with your config settings.

const config: { [key: string]: Knex.Config } = {
  development: {
    debug: true,
    client: "postgresql",
    connection: {
      database: process.env.DB_NAME,
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: "knex_migrations"
    }
  },
  test: {
		client: "postgresql",
		connection: {
			database: process.env.TESTDB_NAME,
			user: process.env.POSTGRES_USER,
			password: process.env.POSTGRES_PASSWORD,
      host: process.env.POSTGRES_HOST
		},
		pool: {
			min: 2,
			max: 10,
		},
		migrations: {
			tableName: "knex_migrations",
		},
	},
  staging: {
    client: "postgresql",
    connection: {
      database: "my_db",
      user: "username",
      password: "password"
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: "knex_migrations"
    }
  },

  production: {
    client: "postgresql",
    connection: {
      database: process.env.POSTGRES_DB,
			user: process.env.POSTGRES_USER,
			password: process.env.POSTGRES_PASSWORD,
			host: process.env.POSTGRES_HOST,
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: "knex_migrations"
    }
  }

};

module.exports = config;
