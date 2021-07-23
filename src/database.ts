import dotenv from "dotenv"
import {Pool} from "pg"

dotenv.config()

const {
  POSTGRES_HOST,
  POSTGRES_DB,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_HOST_TEST,
  ENV
} = process.env

const config = {
  host: POSTGRES_HOST,
  database: POSTGRES_DB,
  user: POSTGRES_USER,
  password: POSTGRES_PASSWORD
}

if (ENV === "test") {
  config.host = POSTGRES_HOST_TEST
}

export default new Pool(config)
