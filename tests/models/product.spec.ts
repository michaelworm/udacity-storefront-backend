import {BaseProduct, Product, ProductStore} from "../../src/models/product"

const ProductStoreInstance = new ProductStore()

describe("Product Model", () => {
  const product: BaseProduct = {
    name: "CodeMaster 3000",
    price: 2000
  }

  async function createProduct (product: BaseProduct) {
    return ProductStoreInstance.create(product)
  }

  async function removeProduct (id: number) {
    return ProductStoreInstance.remove(id)
  }

  it("should have an index method", () => {
    expect(ProductStoreInstance.index).toBeDefined()
  })

  it("should have a show method", () => {
    expect(ProductStoreInstance.read).toBeDefined()
  })

  it("should have a add method", () => {
    expect(ProductStoreInstance.create).toBeDefined()
  })

  it("should have a delete method", () => {
    expect(ProductStoreInstance.remove).toBeDefined()
  })

  it("add method should add a product", async () => {
    const createdProduct: Product = await createProduct(product)

    expect(createdProduct).toEqual({
      id: createdProduct.id,
      ...product
    })

    await removeProduct(createdProduct.id)
  })

  it("index method should return a list of products", async () => {
    const createdProduct: Product = await createProduct(product)
    const productList = await ProductStoreInstance.index()

    expect(productList).toEqual([createdProduct])

    await removeProduct(createdProduct.id)
  })

  it("show method should return the correct product", async () => {
    const createdProduct: Product = await createProduct(product)
    const productFromDb = await ProductStoreInstance.read(createdProduct.id)

    expect(productFromDb).toEqual(createdProduct)

    await removeProduct(createdProduct.id)
  })

  it("delete method should remove the product", async () => {
    const createdProduct: Product = await createProduct(product)

    await removeProduct(createdProduct.id)

    const productList = await ProductStoreInstance.index()

    expect(productList).toEqual([])
  })
})
