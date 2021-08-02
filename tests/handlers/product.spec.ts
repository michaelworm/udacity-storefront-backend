import supertest from "supertest"
import querystring, {ParsedUrlQueryInput} from "querystring"
import jwt, {Secret} from "jsonwebtoken"

import app from "../../src/server"
import {BaseProduct} from "../../src/models/product"

const request = supertest(app)
const SECRET = process.env.TOKEN_SECRET as Secret

describe("Product Handler", () => {
  const product: BaseProduct = {
    name: "CodeMaster 3000",
    price: 999
  }
  const stringifiedProduct: string = querystring.stringify(product as unknown as ParsedUrlQueryInput)

  let token: string, userId: number, productId: number

  beforeAll(async () => {
    const stringifiedUser: string = querystring.stringify({
      username: "produkttester",
      firstname: "Produkt",
      lastname: "Tester",
      password: "password123"
    })

    const {body} = await request.post(`/users/create?${stringifiedUser}`)

    token = body

    // @ts-ignore
    const {user} = jwt.verify(token, SECRET)
    userId = user.id
  })

  afterAll(async () => {
    await request.delete(`/users/${userId}`).set("Authorization", "bearer " + token)
  })

  it("gets the create endpoint", (done) => {
    request
    .post(`/products/create?${stringifiedProduct}`)
    .set("Authorization", "bearer " + token)
    .then((res) => {
      const {body, status} = res

      expect(status).toBe(200)

      productId = body.id

      done()
    })
  })

  it("gets the index endpoint", (done) => {
    request
    .get("/products")
    .then((res) => {
      expect(res.status).toBe(200)
      done()
    })
  })

  it("gets the read endpoint", (done) => {
    request
    .get(`/products/${productId}`)
    .then((res) => {
      expect(res.status).toBe(200)
      done()
    })
  })

  it("gets the update endpoint", (done) => {
    const stringifiedNewProduct: string = querystring.stringify({
      ...product,
      name: "CodeMerge 156 A",
      price: 1299
    })

    request
    .put(`/products/${productId}?${stringifiedNewProduct}`)
    .set("Authorization", "bearer " + token)
    .then((res) => {
      expect(res.status).toBe(200)
      done()
    })
  })

  it("gets the delete endpoint", (done) => {
    request.delete(`/products/${productId}`).set("Authorization", "bearer " + token)
    .then((res) => {
      expect(res.status).toBe(200)
      done()
    })
  })
})
