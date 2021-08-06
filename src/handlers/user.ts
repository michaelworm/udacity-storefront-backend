import {Application, Request, Response} from "express"
import {User, UserStore} from "../models/user"
import {checkAuthHeader, getTokenByUser} from "./helpers"

const UserStoreInstance = new UserStore()

const index = async (req: Request, res: Response) => {
  try {
    const users: User[] = await UserStoreInstance.index()

    res.json(users)
  } catch (e) {
    res.status(400)
    res.json(e)
  }
}

const create = async (req: Request, res: Response) => {
  try {
    const firstname = req.body.firstname as unknown as string
    const lastname = req.body.lastname as unknown as string
    const username = req.body.username as unknown as string
    const password = req.body.password as unknown as string

    if (firstname === undefined || lastname === undefined || username === undefined || password === undefined) {
      res.status(400)
      res.send("Some required parameters are missing! eg. :firstname, :lastname, :username, :password")
      return false
    }

    const user: User = await UserStoreInstance.create({firstname, lastname, username, password})

    res.json(getTokenByUser(user))
  } catch (e) {
    res.status(400)
    res.json(e)
  }
}

const read = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as unknown as number

    if (id === undefined) {
      res.status(400)
      res.send("Missing required parameter :id.")
      return false
    }

    const user: User = await UserStoreInstance.read(id)

    res.json(user)
  } catch (e) {
    res.status(400)
    res.json(e)
  }
}

const update = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as unknown as number
    const firstname = req.body.firstname as unknown as string
    const lastname = req.body.lastname as unknown as string

    if (firstname === undefined || lastname === undefined || id === undefined) {
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
    const id = req.params.id as unknown as number

    if (id === undefined) {
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
    const username = req.body.username as unknown as string
    const password = req.body.password as unknown as string

    if (username === undefined || password === undefined) {
      res.status(400)
      res.send("Some required parameters are missing! eg. :username, :password")
      return false
    }

    const user: User | null = await UserStoreInstance.authenticate(username, password)

    if (user === null) {
      res.status(401)
      res.send(`Wrong password for user ${username}.`)

      return false
    }

    res.json(getTokenByUser(user))
  } catch (e) {
    res.status(400)
    res.json(e)
  }
}

export default function userRoutes (app: Application) {
  app.get("/users", checkAuthHeader, index)
  app.post("/users/create", create)
  app.get("/users/:id", checkAuthHeader, read)
  app.put("/users/:id", checkAuthHeader, update)
  app.delete("/users/:id", checkAuthHeader, deleteUser)
  app.post("/users/auth", authenticate)
}
