import supertest from "supertest"
import querystring from "querystring"
import jwt, {Secret} from "jsonwebtoken"

import app from "../../src/server"

const request = supertest(app)
const SECRET = process.env.TOKEN_SECRET as Secret

describe("Product Handler", () => {
  const product = {
    name: "CodeMaster 3000",
    price: 999
  }
  const stringifiedProduct: string = querystring.stringify(product)

  let token: string, userId: number, productId: number

  beforeAll((done) => {
    const stringifiedUser: string = querystring.stringify({
      username: "produkttester",
      firstname: "Produkt",
      lastname: "Tester",
      password: "password123"
    })

    request
    .post(`/users/create?${stringifiedUser}`)
    .then((res) => {
      token = res.body

      // @ts-ignore
      const {user} = jwt.verify(token, SECRET)
      userId = user.id

      done()
    })
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
    .get("/products").set("Authorization", "bearer " + token)
    .set("Authorization", "bearer " + token)
    .then((res) => {
      expect(res.status).toBe(200)
      done()
    })
  })

  it("gets the read endpoint", (done) => {
    request
    .get(`/products/${productId}`)
    .set("Authorization", "bearer " + token)
    .then((res) => {
      expect(res.status).toBe(200)
      done()
    })
  })

  it("gets the update endpoint", (done) => {
    request
    .put(`/products/${productId}?name=${product.name + "test2"}&price=${product.price + "test2"}`)
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
