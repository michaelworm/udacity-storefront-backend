import Client from "../database"

export type Order = {
  id: number;
  products: number[];
  quantity: number[];
  userId: number;
  status: boolean;
}

export class OrderStore {
  async index (): Promise<Order[]> {
    try {
      const conn = await Client.connect()
      const sql = "SELECT * FROM orders"

      const result = await conn.query(sql)

      conn.release()

      return result.rows
    } catch (err) {
      throw new Error(`Could not get orders. Error: ${err}`)
    }
  }

  async show (id: string): Promise<Order> {
    try {
      const sql = "SELECT * FROM orders WHERE id=($1)"
      const conn = await Client.connect()
      const {rows} = await conn.query(sql, [id])

      conn.release()

      return rows[0]
    } catch (err) {
      throw new Error(`Could not find order ${id}. Error: ${err}`)
    }
  }

  async add (order: Order): Promise<Order> {
    const {products, quantity, status, userId} = order

    try {
      const sql = "INSERT INTO orders (products, quantities, userid, status) VALUES($1, $2, $3, $4) RETURNING *"
      const conn = await Client.connect()
      const {rows} = await conn.query(sql, [products, quantity, status, userId])

      conn.release()

      return rows[0]
    } catch (err) {
      throw new Error(`Could not add new order for user ${userId}. Error: ${err}`)
    }
  }

  async delete (id: string): Promise<Order> {
    try {
      const sql = "DELETE FROM orders WHERE id=($1)"
      const conn = await Client.connect()
      const {rows} = await conn.query(sql, [id])

      conn.release()

      return rows[0]
    } catch (err) {
      throw new Error(`Could not delete order ${id}. Error: ${err}`)
    }
  }
}
