import {Order, OrderStore} from "../../../src/models/order"

const store = new OrderStore()

describe("Order Model", () => {
  const order: Order = {
    id: 1,
    orderProducts: [1],
    quantity: [5],
    userId: 1,
    status: true
  }

  it("should have an index method", () => {
    expect(store.index).toBeDefined()
  })

  it("should have a show method", () => {
    expect(store.show).toBeDefined()
  })

  it("should have a add method", () => {
    expect(store.add).toBeDefined()
  })

  it("should have a delete method", () => {
    expect(store.delete).toBeDefined()
  })

  it("add method should add a order", async () => {
    const result = await store.add(order)
    expect(result).toEqual(order)
  })

  it("index method should return a list of orders", async () => {
    const result = await store.index()
    expect(result).toEqual([order])
  })

  it("show method should return the correct orders", async () => {
    const result = await store.show(1)
    expect(result).toEqual(order)
  })

  it("delete method should remove the order", async () => {
    await store.delete(1)
    const result = await store.index()

    expect(result).toEqual([])
  })
})
