import Client from "../database"

export type Product = {
  id: number;
  name: string;
  price: number;
}

export class ProductStore {
  async index (): Promise<Product[]> {
    try {
      const conn = await Client.connect()
      const sql = "SELECT * FROM products"

      const result = await conn.query(sql)

      conn.release()

      return result.rows
    } catch (err) {
      throw new Error(`Could not get products. Error: ${err}`)
    }
  }

  async show (id: string): Promise<Product> {
    try {
      const sql = "SELECT * FROM products WHERE id=($1)"
      const conn = await Client.connect()
      const {rows} = await conn.query(sql, [id])

      conn.release()

      return rows[0]
    } catch (err) {
      throw new Error(`Could not find product ${id}. Error: ${err}`)
    }
  }

  async add (product: Product): Promise<Product> {
    const {name, price} = product

    try {
      const sql = "INSERT INTO products (name, price) VALUES($1, $2) RETURNING *"
      const conn = await Client.connect()
      const {rows} = await conn.query(sql, [name, price])

      conn.release()

      return rows[0]
    } catch (err) {
      throw new Error(`Could not add new product ${name}. Error: ${err}`)
    }
  }

  async delete (id: string): Promise<Product> {
    try {
      const sql = "DELETE FROM products WHERE id=($1)"
      const conn = await Client.connect()
      const {rows} = await conn.query(sql, [id])

      conn.release()

      return rows[0]
    } catch (err) {
      throw new Error(`Could not delete product ${id}. Error: ${err}`)
    }
  }
}
