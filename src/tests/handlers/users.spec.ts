import supertest from "supertest"
import jwt, {Secret} from "jsonwebtoken"

import app from "../../server"
import {BaseAuthUser} from "../../models/user"

const request = supertest(app)
const SECRET = process.env.TOKEN_SECRET as Secret

describe("User Handler", () => {
  const userData: BaseAuthUser = {
    username: "hansmeier",
    firstname: "Hans",
    lastname: "Meier",
    password: "password123"
  }

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
    .put(`/users/${userId}`)
    .send({
      firstName: userData.firstname + "test",
      lastName: userData.lastname + "test"
    })
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
    .post("/users/create")
    .send(userData)
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
    const newUserData: BaseAuthUser = {
      ...userData,
      firstname: "Lorenz",
      lastname: "Meier"
    }

    request
    .put(`/users/${userId}`)
    .send(newUserData)
    .set("Authorization", "bearer " + token)
    .then((res) => {
      expect(res.status).toBe(200)
      done()
    })
  })

  it("gets the auth endpoint", (done) => {
    request
    .post("/users/auth")
    .send({
      username: userData.username,
      password: userData.password
    })
    .set("Authorization", "bearer " + token)
    .then((res) => {
      expect(res.status).toBe(200)
      done()
    })
  })

  it("gets the auth endpoint with wrong password", (done) => {
    request
    .post("/users/auth")
    .send({
      username: userData.username,
      password: "wrongpw"
    })
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
