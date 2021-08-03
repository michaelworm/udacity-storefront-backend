import {BaseAuthUser, BaseUser, User, UserStore} from "../../models/user"

const UserStoreInstance = new UserStore()

describe("User Model", () => {
  const user: BaseAuthUser = {
    username: "hansmeier",
    firstname: "Hans",
    lastname: "Meier",
    password: "password123"
  }

  async function createUser (user: BaseAuthUser) {
    return UserStoreInstance.create(user)
  }

  async function deleteUser (id: number) {
    return UserStoreInstance.deleteUser(id)
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
    expect(UserStoreInstance.deleteUser).toBeDefined()
  })

  it("create method should create a user", async () => {
    const createdUser: User = await createUser(user)

    if (createdUser) {
      const {username, firstname, lastname} = createdUser

      expect(username).toBe(user.username)
      expect(firstname).toBe(user.firstname)
      expect(lastname).toBe(user.lastname)
    }

    await deleteUser(createdUser.id)
  })

  it("index method should return a list of users", async () => {
    const createdUser: User = await createUser(user)
    const userList = await UserStoreInstance.index()

    expect(userList).toEqual([createdUser])

    await deleteUser(createdUser.id)
  })

  it("show method should return the correct users", async () => {
    const createdUser: User = await createUser(user)
    const userFromDb = await UserStoreInstance.read(createdUser.id)

    expect(userFromDb).toEqual(createdUser)

    await deleteUser(createdUser.id)
  })

  it("remove method should remove the user", async () => {
    const createdUser: User = await createUser(user)

    await deleteUser(createdUser.id)

    const userList = await UserStoreInstance.index()

    expect(userList).toEqual([])
  })

  it("update method should update the user", async () => {
    const createdUser: User = await createUser(user)
    const newUserData: BaseUser = {
      firstname: "Peter",
      lastname: "Meier",
    }

    const {firstname, lastname} = await UserStoreInstance.update(createdUser.id, newUserData)

    expect(firstname).toEqual(newUserData.firstname)
    expect(lastname).toEqual(newUserData.lastname)

    await deleteUser(createdUser.id)
  })

  it("authenticates the user with a password", async () => {
    const createdUser: User = await createUser(user)

    const userFromDb = await UserStoreInstance.authenticate(user.username, user.password)

    if (userFromDb) {
      const {username, firstname, lastname} = userFromDb

      expect(username).toBe(user.username)
      expect(firstname).toBe(user.firstname)
      expect(lastname).toBe(user.lastname)
    }

    await deleteUser(createdUser.id)
  })
})
