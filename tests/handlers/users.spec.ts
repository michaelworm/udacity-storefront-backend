import supertest from "supertest"
import querystring from "querystring"

import app from "../../src/server"

const request = supertest(app)

describe("User Handlers", () => {
  const user = {
    username: "hansmeier",
    firstname: "Hans",
    lastname: "Meier",
    password: "password123"
  }
  const userId: number = 1
  const stringifiedUser: string = querystring.stringify(user)

  let token: string

  it("should require authorization", (done) => {
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

  it("creates a user via endpoint", (done) => {
    request
    .post(`/users/create?${stringifiedUser}`)
    .then((res) => {
      const {body, status} = res
      token = body

      expect(status).toBe(200)
      done()
    })
  })

  it("gets the index endpoint", (done) => {
    request
    .get(`/users`).set("Authorization", "bearer " + token)
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
    request
    .put(`/users/${userId}?firstname=${user.firstname + "test2"}&lastname=${user.lastname + "test2"}`)
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

  it("deletes a user via endpoint", (done) => {
    request.
    delete(`/users/1`).set("Authorization", "bearer " + token)
    .then((res) => {
      expect(res.status).toBe(200)
      done()
    })
  })
})
