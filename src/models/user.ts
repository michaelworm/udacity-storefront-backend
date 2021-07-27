// @ts-ignore
import Client from "../database"

export interface AddUser {
  firstname: string;
  lastname: string;
  password: string;
}

export interface ReadUser {
  id: number;
  firstname: string;
  lastname: string;
  password: string;
}

export class UserStore {
  async index (): Promise<ReadUser[]> {
    try {
      // @ts-ignore
      const conn = await Client.connect()
      const sql = "SELECT * FROM users"

      const result = await conn.query(sql)

      conn.release()

      return result.rows
    } catch (err) {
      throw new Error(`Could not get users. ${err}`)
    }
  }

  async read (id: number): Promise<ReadUser> {
    try {
      const sql = "SELECT * FROM users WHERE id=($1)"
      // @ts-ignore
      const conn = await Client.connect()
      const {rows} = await conn.query(sql, [id])

      conn.release()

      return rows[0]
    } catch (err) {
      throw new Error(`Could not find user ${id}. ${err}`)
    }
  }

  async create (user: AddUser): Promise<ReadUser> {
    const {firstname, lastname, password} = user

    try {
      const sql = "INSERT INTO users (firstname, lastname, password) VALUES($1, $2, $3) RETURNING *"
      // @ts-ignore
      const conn = await Client.connect()
      const {rows} = await conn.query(sql, [firstname, lastname, password])

      conn.release()

      return rows[0]
    } catch (err) {
      throw new Error(`Could not add new user ${firstname} ${lastname}. ${err}`)
    }
  }

  async remove (id: number): Promise<ReadUser> {
    try {
      const sql = "DELETE FROM users WHERE id=($1)"
      // @ts-ignore
      const conn = await Client.connect()
      const {rows} = await conn.query(sql, [id])

      conn.release()

      return rows[0]
    } catch (err) {
      throw new Error(`Could not delete user ${id}. ${err}`)
    }
  }
}
