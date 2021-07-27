import {Product, ProductStore} from "../../../src/models/product"

const ProductStoreInstance = new ProductStore()

describe("Product Model", () => {
  const product: Product = {
    id: 1,
    name: "CodeMaster 3000",
    price: 2000
  }

  it("should have an index method", () => {
    expect(ProductStoreInstance.index).toBeDefined()
  })

  it("should have a show method", () => {
    expect(ProductStoreInstance.show).toBeDefined()
  })

  it("should have a add method", () => {
    expect(ProductStoreInstance.add).toBeDefined()
  })

  it("should have a delete method", () => {
    expect(ProductStoreInstance.delete).toBeDefined()
  })

  it("add method should add a product", async () => {
    const result = await ProductStoreInstance.add(product)
    expect(result).toEqual(product)
  })

  it("index method should return a list of products", async () => {
    const result = await ProductStoreInstance.index()
    expect(result).toEqual([product])
  })

  it("show method should return the correct product", async () => {
    const result = await ProductStoreInstance.show(1)
    expect(result).toEqual(product)
  })

  it("delete method should remove the product", async () => {
    await ProductStoreInstance.delete(1)
    const result = await ProductStoreInstance.index()

    expect(result).toEqual([])
  })
})
