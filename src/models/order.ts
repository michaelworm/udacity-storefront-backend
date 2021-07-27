// @ts-ignore
import Client from "../database"

export type Order = {
  id: number;
  order_products: number[];
  quantity: number[];
  user_id: number;
  status: boolean;
}

export class OrderStore {
  async index (): Promise<Order[]> {
    try {
      // @ts-ignore
      const conn = await Client.connect()
      const sql = "SELECT * FROM orders"

      const result = await conn.query(sql)

      conn.release()

      return result.rows
    } catch (err) {
      throw new Error(`Could not get orders. ${err}`)
    }
  }

  async show (id: number): Promise<Order> {
    try {
      const sql = "SELECT * FROM orders WHERE id=($1)"
      // @ts-ignore
      const conn = await Client.connect()
      const {rows} = await conn.query(sql, [id])

      conn.release()

      return rows[0]
    } catch (err) {
      throw new Error(`Could not find order ${id}. ${err}`)
    }
  }

  async add (order: Order): Promise<Order> {
    const {order_products, quantity, status, user_id} = order

    try {
      const sql = "INSERT INTO orders (order_products, quantity, user_id, status) VALUES($1, $2, $3, $4) RETURNING *"
      // @ts-ignore
      const conn = await Client.connect()
      const {rows} = await conn.query(sql, [order_products, quantity, user_id, status])

      conn.release()

      return rows[0]
    } catch (err) {
      throw new Error(`Could not add new order for user ${user_id}. ${err}`)
    }
  }

  async delete (id: number): Promise<Order> {
    try {
      const sql = "DELETE FROM orders WHERE id=($1)"
      // @ts-ignore
      const conn = await Client.connect()
      const {rows} = await conn.query(sql, [id])

      conn.release()

      return rows[0]
    } catch (err) {
      throw new Error(`Could not delete order ${id}. ${err}`)
    }
  }
}
