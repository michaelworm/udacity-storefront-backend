// @ts-ignore
import Client from "../database"

export interface AddOrder {
  product_list: number[];
  quantity: number[];
  user_id: number;
  status: boolean;
}

export interface ReadOrder extends AddOrder {
  id: number;
}

export class OrderStore {
  async index (): Promise<ReadOrder[]> {
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

  async read (id: number): Promise<ReadOrder> {
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

  async create (order: AddOrder): Promise<ReadOrder> {
    const {product_list, quantity, status, user_id} = order

    try {
      const sql = "INSERT INTO orders (product_list, quantity, user_id, status) VALUES($1, $2, $3, $4) RETURNING *"
      // @ts-ignore
      const conn = await Client.connect()
      const {rows} = await conn.query(sql, [product_list, quantity, user_id, status])

      conn.release()

      return rows[0]
    } catch (err) {
      throw new Error(`Could not add new order for user ${user_id}. ${err}`)
    }
  }

  async remove (id: number): Promise<ReadOrder> {
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
