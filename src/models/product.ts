// @ts-ignore
import Client from "../database"

export interface AddProduct {
  name: string;
  price: number;
}

export interface ReadProduct extends AddProduct {
  id: number;
}

export class ProductStore {
  async index (): Promise<ReadProduct[]> {
    try {
      // @ts-ignore
      const conn = await Client.connect()
      const sql = "SELECT * FROM products"

      const result = await conn.query(sql)

      conn.release()

      return result.rows
    } catch (err) {
      throw new Error(`Could not get products. ${err}`)
    }
  }

  async read (id: number): Promise<ReadProduct> {
    try {
      const sql = "SELECT * FROM products WHERE id=($1)"
      // @ts-ignore
      const conn = await Client.connect()
      const {rows} = await conn.query(sql, [id])

      conn.release()

      return rows[0]
    } catch (err) {
      throw new Error(`Could not find product ${id}. ${err}`)
    }
  }

  async create (product: AddProduct): Promise<ReadProduct> {
    const {name, price} = product

    try {
      const sql = "INSERT INTO products (name, price) VALUES($1, $2) RETURNING *"
      // @ts-ignore
      const conn = await Client.connect()
      const {rows} = await conn.query(sql, [name, price])

      conn.release()

      return rows[0]
    } catch (err) {
      throw new Error(`Could not add new product ${name}. ${err}`)
    }
  }

  async remove (id: number): Promise<ReadProduct> {
    try {
      const sql = "DELETE FROM products WHERE id=($1)"
      // @ts-ignore
      const conn = await Client.connect()
      const {rows} = await conn.query(sql, [id])

      conn.release()

      return rows[0]
    } catch (err) {
      throw new Error(`Could not delete product ${id}. ${err}`)
    }
  }
}
