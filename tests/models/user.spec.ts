import {BaseUser, User, UserStore} from "../../src/models/user"

const UserStoreInstance = new UserStore()

describe("User Model", () => {
  const user: BaseUser = {
    username: "hansmeier",
    firstname: "Hans",
    lastname: "Meier",
    password_digest: "password123"
  }

  async function createUser (user: BaseUser) {
    return UserStoreInstance.create(user)
  }

  async function removeUser (id: number) {
    return UserStoreInstance.remove(id)
  }

  it("should have an index method", () => {
    expect(UserStoreInstance.index).toBeDefined()
  })

  it("should have a show method", () => {
    expect(UserStoreInstance.read).toBeDefined()
  })

  it("should have a create method", () => {
    expect(UserStoreInstance.create).toBeDefined()
  })

  it("should have a remove method", () => {
    expect(UserStoreInstance.remove).toBeDefined()
  })

  it("create method should create a user", async () => {
    const createdUser: User = await createUser(user)

    expect(createdUser).toEqual({
      id: createdUser.id,
      ...user
    })

    await removeUser(createdUser.id)
  })

  it("index method should return a list of users", async () => {
    const createdUser: User = await createUser(user)
    const userList = await UserStoreInstance.index()

    expect(userList).toEqual([createdUser])

    await removeUser(createdUser.id)
  })

  it("show method should return the correct users", async () => {
    const createdUser: User = await createUser(user)
    const userFromDb = await UserStoreInstance.read(createdUser.id)

    expect(userFromDb).toEqual(createdUser)

    await removeUser(createdUser.id)
  })

  it("remove method should remove the user", async () => {
    const createdUser: User = await createUser(user)

    await removeUser(createdUser.id)

    const userList = await UserStoreInstance.index()

    expect(userList).toEqual([])
  })

  it("authenticates the user with a password", async () => {
    const createdUser: User = await createUser(user)

    const isAuthenticated = await UserStoreInstance.authenticate(user.username, user.password_digest)

    expect(isAuthenticated).toBe(true)

    await removeUser(createdUser.id)
  })
})
