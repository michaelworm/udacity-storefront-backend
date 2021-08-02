import {Application, Request, Response} from "express"
import {Order, OrderStore} from "../models/order"
import {checkAuthHeader} from "./helpers"

const OrderStoreInstance = new OrderStore()

const index = async (req: Request, res: Response) => {
  if (!req.headers.authorization || !checkAuthHeader(req.headers.authorization)) {
    res.status(401)
    res.json("Access denied, invalid token")

    return false
  }

  try {
    const orders: Order[] = await OrderStoreInstance.index()

    res.json(orders)
  } catch (e) {
    res.status(400)
    res.json(e)
  }
}

const create = async (req: Request, res: Response) => {
  if (!req.headers.authorization || !checkAuthHeader(req.headers.authorization)) {
    res.status(401)
    res.json("Access denied, invalid token")

    return false
  }

  try {
    let product_list = req.query.product_list as unknown as number[]
    let quantity = req.query.quantity as unknown as number[]
    const status = req.query.status as unknown as boolean
    const user_id = req.query.user_id as unknown as number

    if (!product_list || !quantity || !status || !user_id) {
      res.status(400)
      res.send("Some required parameters are missing! eg. :product_list, :quantity, :status, :user_id")
      return false
    }

    if (!Array.isArray(product_list)) {
      product_list = [product_list]
    }

    if (!Array.isArray(quantity)) {
      quantity = [quantity]
    }

    const order: Order = await OrderStoreInstance.create({product_list, quantity, status, user_id})

    res.json(order)
  } catch (e) {
    res.status(400)
    res.json(e)
  }
}

const read = async (req: Request, res: Response) => {
  if (!req.headers.authorization || !checkAuthHeader(req.headers.authorization)) {
    res.status(401)
    res.json("Access denied, invalid token")

    return false
  }

  try {
    const id = parseInt(req.params.id, 10)

    if (!id) {
      res.status(400)
      res.send("Missing required parameter :id.")
      return false
    }

    const order: Order = await OrderStoreInstance.read(id)

    res.json(order)
  } catch (e) {
    res.status(400)
    res.json(e)
  }
}

const update = async (req: Request, res: Response) => {
  if (!req.headers.authorization || !checkAuthHeader(req.headers.authorization)) {
    res.status(401)
    res.json("Access denied, invalid token")

    return false
  }

  try {
    const id = parseInt(req.params.id, 10)
    let product_list = req.query.product_list as unknown as number[]
    let quantity = req.query.quantity as unknown as number[]
    const status = req.query.status as unknown as boolean
    const user_id = req.query.user_id as unknown as number

    if (!product_list || !quantity || !status || !user_id || !id) {
      res.status(400)
      res.send("Some required parameters are missing! eg. :product_list, :quantity, :status, :user_id, :id")
      return false
    }

    if (!Array.isArray(product_list)) {
      product_list = [product_list]
    }

    if (!Array.isArray(quantity)) {
      quantity = [quantity]
    }

    const order: Order = await OrderStoreInstance.update(id, {product_list, quantity, status, user_id})

    res.json(order)
  } catch (e) {
    res.status(400)
    res.json(e)
  }
}

const deleteOrder = async (req: Request, res: Response) => {
  if (!req.headers.authorization || !checkAuthHeader(req.headers.authorization)) {
    res.status(401)
    res.json("Access denied, invalid token")

    return false
  }

  try {
    const id = parseInt(req.params.id, 10)

    if (!id) {
      res.status(400)
      res.send("Missing required parameter :id.")
      return false
    }

    await OrderStoreInstance.deleteOrder(id)

    res.send(`Order with id ${id} successfully deleted.`)
  } catch (e) {
    res.status(400)
    res.json(e)
  }
}

export default function orderRoutes (app: Application) {
  app.get("/orders", index)
  app.post("/orders/create", create)
  app.get("/orders/:id", read)
  app.put("/orders/:id", update)
  app.delete("/orders/:id", deleteOrder)
}
