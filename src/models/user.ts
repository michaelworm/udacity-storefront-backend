import {hashSync, compareSync} from "bcrypt"
import Client from "../database"

const {BCRYPT_PASSWORD, SALT_ROUNDS} = process.env

export interface BaseUser {
  username: string;
  firstname: string;
  lastname: string;
  password_digest: string;
}

export interface User extends BaseUser {
  id: number;
}

export class UserStore {
  async index (): Promise<User[]> {
    try {
      const connection = await Client.connect()
      const sql = "SELECT * FROM users"

      const {rows} = await connection.query(sql)

      connection.release()

      return rows
    } catch (err) {
      throw new Error(`Could not get users. ${err}`)
    }
  }

  async read (id: number): Promise<User> {
    try {
      const sql = "SELECT * FROM users WHERE id=($1)"
      const connection = await Client.connect()
      const {rows} = await connection.query(sql, [id])

      connection.release()

      return rows[0]
    } catch (err) {
      throw new Error(`Could not find user ${id}. ${err}`)
    }
  }

  async create (user: BaseUser): Promise<User> {
    const {firstname, lastname, username, password_digest} = user

    try {
      const sql = "INSERT INTO users (firstname, lastname, username, password_digest) VALUES($1, $2, $3, $4) RETURNING *"
      const hash = hashSync(password_digest + BCRYPT_PASSWORD, parseInt(SALT_ROUNDS as string, 10))
      const connection = await Client.connect()
      const {rows} = await connection.query(sql, [firstname, lastname, username, hash])

      connection.release()

      return rows[0]
    } catch (err) {
      throw new Error(`Could not add new user ${firstname} ${lastname}. ${err}`)
    }
  }

  async remove (id: number): Promise<User> {
    try {
      const sql = "DELETE FROM users WHERE id=($1)"
      const connection = await Client.connect()
      const {rows} = await connection.query(sql, [id])

      connection.release()

      return rows[0]
    } catch (err) {
      throw new Error(`Could not delete user ${id}. ${err}`)
    }
  }

  async authenticate (username: string, password_digest: string): Promise<User | null> {
    try {
      const sql = "SELECT * FROM users WHERE username=($1)"
      const connection = await Client.connect()
      const {rows} = await connection.query(sql, [username])

      if (rows.length > 0) {
        const user = rows[0]

        if (compareSync(password_digest + BCRYPT_PASSWORD, user.password_digest)) {
          return user
        }
      }

      connection.release()

      return null
    } catch (err) {
      throw new Error(`Could not find user ${username}. ${err}`)
    }
  }
}
