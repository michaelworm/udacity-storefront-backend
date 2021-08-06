import {Application, Request, Response} from "express"
import {Product, ProductStore} from "../models/product"
import {checkAuthHeader} from "./helpers"

const ProductStoreInstance = new ProductStore()

const index = async (req: Request, res: Response) => {
  try {
    const products: Product[] = await ProductStoreInstance.index()

    res.json(products)
  } catch (e) {
    res.status(400)
    res.json(e)
  }
}

const create = async (req: Request, res: Response) => {
  try {
    const name = req.body.name as unknown as string
    const price = req.body.price as unknown as number

    if (name === undefined || price === undefined) {
      res.status(400)
      res.send("Some required parameters are missing! eg. :name, :price")
      return false
    }

    const product: Product = await ProductStoreInstance.create({name, price})

    res.json(product)
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

    const product: Product = await ProductStoreInstance.read(id)

    res.json(product)
  } catch (e) {
    res.status(400)
    res.json(e)
  }
}

const update = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as unknown as number
    const name = req.body.name as unknown as string
    const price = req.body.price as unknown as number

    if (name === undefined || price === undefined || id === undefined) {
      res.status(400)
      res.send("Some required parameters are missing! eg. :name, :price, :id")
      return false
    }

    const product: Product = await ProductStoreInstance.update(id, {name, price})

    res.json(product)
  } catch (e) {
    res.status(400)
    res.json(e)
  }
}

const deleteProduct = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as unknown as number

    if (id === undefined) {
      res.status(400)
      res.send("Missing required parameter :id.")
      return false
    }

    await ProductStoreInstance.deleteProduct(id)

    res.send(`Product with id ${id} successfully deleted.`)
  } catch (e) {
    res.status(400)
    res.json(e)
  }
}

export default function productRoutes (app: Application) {
  app.get("/products", index)
  app.post("/products/create", checkAuthHeader, create)
  app.get("/products/:id", read)
  app.put("/products/:id", checkAuthHeader, update)
  app.delete("/products/:id", checkAuthHeader, deleteProduct)
}
