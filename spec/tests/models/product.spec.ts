import {Product, ProductStore} from "../../../src/models/product"

const store = new ProductStore()

describe("Product Model", () => {
  const product: Product = {
    id: 1,
    name: "CodeMaster 3000",
    price: 2000
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

  it("add method should add a product", async () => {
    const result = await store.add(product)
    expect(result).toEqual(product)
  })

  it("index method should return a list of products", async () => {
    const result = await store.index()
    expect(result).toEqual([product])
  })

  it("show method should return the correct product", async () => {
    const result = await store.show(1)
    expect(result).toEqual(product)
  })

  it("delete method should remove the product", async () => {
    await store.delete(1)
    const result = await store.index()

    expect(result).toEqual([])
  })
})
