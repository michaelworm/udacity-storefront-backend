import {Application, Request, Response} from "express"
import {User, UserStore} from "../models/user"

const UserStoreInstance = new UserStore()

const index = async (_req: Request, res: Response) => {
  const users: User[] = await UserStoreInstance.index()

  res.json(users)
}

const create = async (req: Request, res: Response) => {
  try {
    const firstname = req.query.firstname as string
    const lastname = req.query.lastname as string
    const username = req.query.username as string
    const password = req.query.password as string

    if (!firstname || !lastname || !username || !password) {
      res.status(400)
      res.send("Some required parameters are missing! eg. :firstname, :lastname, :username, :password")
      return false
    }

    const user: User = await UserStoreInstance.create({firstname, lastname, username, password})

    res.json(user)
  } catch (e) {
    res.status(400)
    res.json(e)
  }
}

const read = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10)

  if (!id) {
    res.status(400)
    res.send("Missing required parameter :id.")
    return false
  }

  const user: User = await UserStoreInstance.read(id)

  res.json(user)
}

const update = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10)
    const firstname = req.query.firstname as string
    const lastname = req.query.lastname as string

    if (!firstname || !lastname || !id) {
      res.status(400)
      res.send("Some required parameters are missing! eg. :firstname, :lastname, :id")
      return false
    }

    const user: User = await UserStoreInstance.update(id, {firstname, lastname})

    res.json(user)
  } catch (e) {
    res.status(400)
    res.json(e)
  }
}

const deleteUser = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10)

    if (!id) {
      res.status(400)
      res.send("Missing required parameter :id.")
      return false
    }

    await UserStoreInstance.deleteUser(id)

    res.send(`User with id ${id} successfully deleted.`)
  } catch (e) {
    res.status(400)
    res.json(e)
  }
}

const authenticate = async (req: Request, res: Response) => {
  try {
    const {username, password} = req.body

    if (!username || !password) {
      res.status(400)
      res.send("Some required parameters are missing! eg. :username, :password")
      return false
    }

    const user: User | null = await UserStoreInstance.authenticate(username, password)

    if (!user) {
      res.status(401)
      res.send(`Wrong password for user ${username}.`)

      return false
    }

    res.json(user)
  } catch (e) {
    res.status(400)
    res.json(e)
  }
}

export default function userRoutes (app: Application) {
  app.get("/users", index)
  app.post("/users/create", create)
  app.get("/users/:id", read)
  app.put("/users/:id", update)
  app.delete("/users/:id", deleteUser)
  app.post("/users/auth", authenticate)
}
