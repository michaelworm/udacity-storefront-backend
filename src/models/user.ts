import Client from "../database"

export type User = {
  id: number;
  firstName: string;
  lastName: string;
  password: string;
}

export class UserStore {
  async index (): Promise<User[]> {
    try {
      const conn = await Client.connect()
      const sql = "SELECT * FROM users"

      const result = await conn.query(sql)

      conn.release()

      return result.rows
    } catch (err) {
      throw new Error(`Could not get users. Error: ${err}`)
    }
  }

  async show (id: string): Promise<User> {
    try {
      const sql = "SELECT * FROM users WHERE id=($1)"
      const conn = await Client.connect()
      const {rows} = await conn.query(sql, [id])

      conn.release()

      return rows[0]
    } catch (err) {
      throw new Error(`Could not find user ${id}. Error: ${err}`)
    }
  }

  async add (user: User): Promise<User> {
    const {firstName, lastName, password} = user

    try {
      const sql = "INSERT INTO users (firstname, lastname, password) VALUES($1, $2, $3) RETURNING *"
      const conn = await Client.connect()
      const {rows} = await conn.query(sql, [firstName, lastName, password])

      conn.release()

      return rows[0]
    } catch (err) {
      throw new Error(`Could not add new user ${firstName} ${lastName}. Error: ${err}`)
    }
  }

  async delete (id: string): Promise<User> {
    try {
      const sql = "DELETE FROM users WHERE id=($1)"
      const conn = await Client.connect()
      const {rows} = await conn.query(sql, [id])

      conn.release()

      return rows[0]
    } catch (err) {
      throw new Error(`Could not delete user ${id}. Error: ${err}`)
    }
  }
}
