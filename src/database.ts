import dotenv from "dotenv"
import {ClientConfig, Pool} from "pg"

dotenv.config()

const config: ClientConfig = {
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT as unknown as number,
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD
}

if (process.env.ENV === "test") {
  config.port = process.env.POSTGRES_PORT_TEST as unknown as number
}

export default new Pool(config)
