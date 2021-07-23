import {User, UserStore} from "../../../src/models/user"

const store = new UserStore()

describe("User Model", () => {
  const user: User = {
    id: 1,
    firstName: "Hans",
    lastName: "Meier",
    password: "password123"
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

  it("add method should add a user", async () => {
    const result = await store.add(user)
    expect(result).toEqual(user)
  })

  it("index method should return a list of users", async () => {
    const result = await store.index()
    expect(result).toEqual([user])
  })

  it("show method should return the correct users", async () => {
    const result = await store.show(1)
    expect(result).toEqual(user)
  })

  it("delete method should remove the user", async () => {
    await store.delete(1)
    const result = await store.index()

    expect(result).toEqual([])
  })
})
