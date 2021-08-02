import supertest from "supertest"
import querystring, {ParsedUrlQueryInput} from "querystring"
import jwt, {Secret} from "jsonwebtoken"

import app from "../../src/server"
import {BaseOrder} from "../../src/models/order"

const request = supertest(app)
const SECRET = process.env.TOKEN_SECRET as Secret

describe("Order Handler", () => {
  let token: string, order: BaseOrder, stringifiedOrder: string, user_id: number, product_id: number, order_id: number

  beforeAll(async () => {
    const stringifiedUser: string = querystring.stringify({
      username: "ordertester",
      firstname: "Order",
      lastname: "Tester",
      password: "password123"
    })
    const stringifiedProduct: string = querystring.stringify({
      name: "CodeMaster 199",
      price: 199
    })

    const {body: userBody} = await request.post(`/users/create?${stringifiedUser}`)

    token = userBody

    // @ts-ignore
    const {user} = jwt.verify(token, SECRET)
    user_id = user.id

    const {body: productBody} = await request.post(`/products/create?${stringifiedProduct}`).set("Authorization", "bearer " + token)
    product_id = productBody.id

    order = {
      product_list: [product_id],
      quantity: [5,11],
      user_id,
      status: true
    }
    stringifiedOrder = querystring.stringify(order as unknown as ParsedUrlQueryInput)
  })

  afterAll(async () => {
    await request.delete(`/users/${user_id}`).set("Authorization", "bearer " + token)
    await request.delete(`/products/${product_id}`).set("Authorization", "bearer " + token)
  })

  it("gets the create endpoint", (done) => {
    request
    .post(`/orders/create?${stringifiedOrder}`)
    .set("Authorization", "bearer " + token)
    .then((res) => {
      const {body, status} = res

      expect(status).toBe(200)

      order_id = body.id

      done()
    })
  })

  it("gets the index endpoint", (done) => {
    request
    .get("/orders")
    .set("Authorization", "bearer " + token)
    .then((res) => {
      expect(res.status).toBe(200)
      done()
    })
  })

  it("gets the read endpoint", (done) => {
    request
    .get(`/orders/${order_id}`)
    .set("Authorization", "bearer " + token)
    .then((res) => {
      expect(res.status).toBe(200)
      done()
    })
  })

  it("gets the update endpoint", (done) => {
    const stringifiedNewOrder: string = querystring.stringify({
      ...order,
      status: false
    })

    request
    .put(`/orders/${order_id}?${stringifiedNewOrder}`)
    .set("Authorization", "bearer " + token)
    .then((res) => {
      expect(res.status).toBe(200)
      done()
    })
  })

  it("gets the delete endpoint", (done) => {
    request.delete(`/orders/${order_id}`).set("Authorization", "bearer " + token)
    .then((res) => {
      expect(res.status).toBe(200)
      done()
    })
  })
})
