import Client from "../database"

export interface BaseProduct {
  name: string;
  price: number;
}

export interface Product extends BaseProduct {
  id: number;
}

export class ProductStore {
  async index (): Promise<Product[]> {
    try {
      const connection = await Client.connect()
      const sql = "SELECT * FROM products"

      const {rows} = await connection.query(sql)

      connection.release()

      return rows
    } catch (err) {
      throw new Error(`Could not get products. ${err}`)
    }
  }

  async read (id: number): Promise<Product> {
    try {
      const sql = "SELECT * FROM products WHERE id=($1)"
      const connection = await Client.connect()
      const {rows} = await connection.query(sql, [id])

      connection.release()

      return rows[0]
    } catch (err) {
      throw new Error(`Could not find product ${id}. ${err}`)
    }
  }

  async create (product: BaseProduct): Promise<Product> {
    const {name, price} = product

    try {
      const sql = "INSERT INTO products (name, price) VALUES($1, $2) RETURNING *"
      const connection = await Client.connect()
      const {rows} = await connection.query(sql, [name, price])

      connection.release()

      return rows[0]
    } catch (err) {
      throw new Error(`Could not add new product ${name}. ${err}`)
    }
  }

  async remove (id: number): Promise<Product> {
    try {
      const sql = "DELETE FROM products WHERE id=($1)"
      const connection = await Client.connect()
      const {rows} = await connection.query(sql, [id])

      connection.release()

      return rows[0]
    } catch (err) {
      throw new Error(`Could not delete product ${id}. ${err}`)
    }
  }
}
