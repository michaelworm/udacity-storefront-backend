import {Order, OrderStore} from "../../../src/models/order"
import {User, UserStore} from "../../../src/models/user"
import {Product, ProductStore} from "../../../src/models/product"

const OrderStoreInstance = new OrderStore()

describe("Order Model", () => {
  const UserStoreInstance = new UserStore()
  const ProductStoreInstance = new ProductStore()

  let order: Order, user_id: number, product_id: number

  beforeAll(async () => {

    const user: User = await UserStoreInstance.add({
      id: 1,
      firstname: "Hans",
      lastname: "Meier",
      password: "password123"
    })

    user_id = user.id

    const product: Product = await ProductStoreInstance.add({
      id: 1,
      name: "OrderSpec Product",
      price: 99
    })

    product_id = product.id

    order = {
      id: 1,
      order_products: [product_id],
      quantity: [5],
      user_id,
      status: true
    }
  })

  afterAll(async () => {
    await UserStoreInstance.delete(user_id)
    await ProductStoreInstance.delete(product_id)
  })

  it("should have an index method", () => {
    expect(OrderStoreInstance.index).toBeDefined()
  })

  it("should have a show method", () => {
    expect(OrderStoreInstance.show).toBeDefined()
  })

  it("should have a add method", () => {
    expect(OrderStoreInstance.add).toBeDefined()
  })

  it("should have a delete method", () => {
    expect(OrderStoreInstance.delete).toBeDefined()
  })

  it("add method should add a order", async () => {
    const result = await OrderStoreInstance.add(order)
    expect(result).toEqual(order)
  })

  it("index method should return a list of orders", async () => {
    const result = await OrderStoreInstance.index()
    expect(result).toEqual([order])
  })

  it("show method should return the correct orders", async () => {
    const result = await OrderStoreInstance.show(1)
    expect(result).toEqual(order)
  })

  it("delete method should remove the order", async () => {
    await OrderStoreInstance.delete(1)
    const result = await OrderStoreInstance.index()

    expect(result).toEqual([])
  })
})
