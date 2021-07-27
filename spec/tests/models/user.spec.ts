import {User, UserStore} from "../../../src/models/user"

const UserStoreInstance = new UserStore()

describe("User Model", () => {
  const user: User = {
    id: 1,
    firstname: "Hans",
    lastname: "Meier",
    password: "password123"
  }

  it("should have an index method", () => {
    expect(UserStoreInstance.index).toBeDefined()
  })

  it("should have a show method", () => {
    expect(UserStoreInstance.show).toBeDefined()
  })

  it("should have a add method", () => {
    expect(UserStoreInstance.add).toBeDefined()
  })

  it("should have a delete method", () => {
    expect(UserStoreInstance.delete).toBeDefined()
  })

  it("add method should add a user", async () => {
    const result = await UserStoreInstance.add(user)
    expect(result).toEqual(user)
  })

  it("index method should return a list of users", async () => {
    const result = await UserStoreInstance.index()
    expect(result).toEqual([user])
  })

  it("show method should return the correct users", async () => {
    const result = await UserStoreInstance.show(1)
    expect(result).toEqual(user)
  })

  it("delete method should remove the user", async () => {
    await UserStoreInstance.delete(1)
    const result = await UserStoreInstance.index()

    expect(result).toEqual([])
  })
})
