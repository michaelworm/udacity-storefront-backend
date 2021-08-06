import {Application, Request, Response} from "express"
import {Order, OrderProduct, OrderStore} from "../models/order"
import {checkAuthHeader} from "./helpers"

const OrderStoreInstance = new OrderStore()

const index = async (req: Request, res: Response) => {
  try {
    const orders: Order[] = await OrderStoreInstance.index()

    res.json(orders)
  } catch (e) {
    res.status(400)
    res.json(e)
  }
}

const create = async (req: Request, res: Response) => {
  try {
    let products = req.body.products as unknown as OrderProduct[]
    const status = req.body.status as unknown as boolean
    const user_id = req.body.user_id as unknown as number

    if (products === undefined || status === undefined || user_id === undefined) {
      res.status(400)
      res.send("Some required parameters are missing! eg. :products, :status, :user_id")
      return false
    }

    const order: Order = await OrderStoreInstance.create({products, status, user_id})

    res.json(order)
  } catch (e) {
    res.status(400)
    res.json(e)
  }
}

const read = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as unknown as number

    if (id === undefined) {
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
  try {
    const id = req.params.id as unknown as number
    let products = req.body.products as unknown as OrderProduct[]
    const status = req.body.status as unknown as boolean
    const user_id = req.body.user_id as unknown as number

    if (products === undefined || status === undefined || user_id === undefined || id === undefined) {
      res.status(400)
      res.send("Some required parameters are missing! eg. :products, :status, :user_id, :id")
      return false
    }

    const order: Order = await OrderStoreInstance.update(id, {products, status, user_id})

    res.json(order)
  } catch (e) {
    res.status(400)
    res.json(e)
  }
}

const deleteOrder = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as unknown as number

    if (id === undefined) {
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
  app.get("/orders", checkAuthHeader, index)
  app.post("/orders/create", checkAuthHeader, create)
  app.get("/orders/:id", checkAuthHeader, read)
  app.put("/orders/:id", checkAuthHeader, update)
  app.delete("/orders/:id", checkAuthHeader, deleteOrder)
}
