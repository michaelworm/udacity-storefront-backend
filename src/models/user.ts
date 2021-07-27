// @ts-ignore
import Client from "../database"

export type User = {
  id: number;
  firstname: string;
  lastname: string;
  password: string;
}

export class UserStore {
  async index (): Promise<User[]> {
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

  async show (id: number): Promise<User> {
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

  async add (user: User): Promise<User> {
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

  async delete (id: number): Promise<User> {
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
