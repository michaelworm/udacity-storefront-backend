import supertest from "supertest"
import querystring, {ParsedUrlQueryInput} from "querystring"
import jwt, {Secret} from "jsonwebtoken"

import app from "../../server"
import {BaseAuthUser} from "../../models/user"

const request = supertest(app)
const SECRET = process.env.TOKEN_SECRET as Secret

describe("User Handler", () => {
  const user: BaseAuthUser = {
    username: "hansmeier",
    firstname: "Hans",
    lastname: "Meier",
    password: "password123"
  }
  const stringifiedUser: string = querystring.stringify(user as unknown as ParsedUrlQueryInput)

  let token: string, userId: number = 1

  it("should require authorization on every endpoint", (done) => {
    request
    .get("/users")
    .then((res) => {
      expect(res.status).toBe(401)
      done()
    })

    request
    .get(`/users/${userId}`)
    .then((res) => {
      expect(res.status).toBe(401)
      done()
    })

    request
    .put(`/users/${userId}?firstname=${user.firstname + "test2"}&lastname=${user.lastname + "test2"}`)
    .then((res) => {
      expect(res.status).toBe(401)
      done()
    })

    request
    .delete(`/users/${userId}`)
    .then((res) => {
      expect(res.status).toBe(401)
      done()
    })
  })

  it("gets the create endpoint", (done) => {
    request
    .post(`/users/create?${stringifiedUser}`)
    .then((res) => {
      const {body, status} = res
      token = body

      // @ts-ignore
      const {user} = jwt.verify(token, SECRET)
      userId = user.id

      expect(status).toBe(200)
      done()
    })
  })

  it("gets the index endpoint", (done) => {
    request
    .get("/users")
    .set("Authorization", "bearer " + token)
    .then((res) => {
      expect(res.status).toBe(200)
      done()
    })
  })

  it("gets the read endpoint", (done) => {
    request
    .get(`/users/${userId}`)
    .set("Authorization", "bearer " + token)
    .then((res) => {
      expect(res.status).toBe(200)
      done()
    })
  })

  it("gets the update endpoint", (done) => {
    const stringifiedUpdatedUser: string = querystring.stringify({
      ...user,
      firstname: "Lorenz",
      lastname: "Meier"
    })

    request
    .put(`/users/${userId}?${stringifiedUpdatedUser}`)
    .set("Authorization", "bearer " + token)
    .then((res) => {
      expect(res.status).toBe(200)
      done()
    })
  })

  it("gets the auth endpoint", (done) => {
    request
    .post(`/users/auth?username=${user.username}&password=${user.password}`)
    .set("Authorization", "bearer " + token)
    .then((res) => {
      expect(res.status).toBe(200)
      done()
    })
  })

  it("gets the auth endpoint with wrong password", (done) => {
    request
    .post(`/users/auth?username=${user.username}&password=wrongpw`)
    .set("Authorization", "bearer " + token)
    .then((res) => {
      expect(res.status).toBe(401)
      done()
    })
  })

  it("gets the delete endpoint", (done) => {
    request
    .delete(`/users/${userId}`)
    .set("Authorization", "bearer " + token)
    .then((res) => {
      expect(res.status).toBe(200)
      done()
    })
  })
})
