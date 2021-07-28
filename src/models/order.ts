import Client from "../database"

export interface BaseOrder {
  product_list: number[];
  quantity: number[];
  user_id: number;
  status: boolean;
}

export interface Order extends BaseOrder {
  id: number;
}

export class OrderStore {
  async index (): Promise<Order[]> {
    try {
      const connection = await Client.connect()
      const sql = "SELECT * FROM orders"

      const {rows} = await connection.query(sql)

      connection.release()

      return rows
    } catch (err) {
      throw new Error(`Could not get orders. ${err}`)
    }
  }

  async create (order: BaseOrder): Promise<Order> {
    const {product_list, quantity, status, user_id} = order

    try {
      const sql = "INSERT INTO orders (product_list, quantity, user_id, status) VALUES($1, $2, $3, $4) RETURNING *"
      const connection = await Client.connect()
      const {rows} = await connection.query(sql, [product_list, quantity, user_id, status])

      connection.release()

      return rows[0]
    } catch (err) {
      throw new Error(`Could not add new order for user ${user_id}. ${err}`)
    }
  }

  async read (id: number): Promise<Order> {
    try {
      const sql = "SELECT * FROM orders WHERE id=($1)"
      const connection = await Client.connect()
      const {rows} = await connection.query(sql, [id])

      connection.release()

      return rows[0]
    } catch (err) {
      throw new Error(`Could not find order ${id}. ${err}`)
    }
  }

  async update (order: Order, newOrderData: BaseOrder): Promise<Order> {
    const {id} = order
    const {product_list, quantity, status, user_id} = newOrderData

    try {
      const sql = "UPDATE orders SET product_list = $1, quantity = $2, user_id = $3, status = $4 WHERE id = $5 RETURNING *"
      const connection = await Client.connect()
      const {rows} = await connection.query(sql, [product_list, quantity, user_id, status, id])

      connection.release()

      return rows[0]
    } catch (err) {
      throw new Error(`Could not update order for user ${user_id}. ${err}`)
    }
  }

  async deleteOrder (id: number): Promise<Order> {
    try {
      const sql = "DELETE FROM orders WHERE id=($1)"
      const connection = await Client.connect()
      const {rows} = await connection.query(sql, [id])

      connection.release()

      return rows[0]
    } catch (err) {
      throw new Error(`Could not delete order ${id}. ${err}`)
    }
  }
}
