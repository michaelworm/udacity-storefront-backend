import express, {Application, Request, Response} from "express"
import bodyParser from "body-parser"
import path from "path"

import userRoutes from "./handlers/user"

const app: Application = express()
const address: string = "127.0.0.1:3000"

app.use(bodyParser.json())

app.get("/", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../index.html'));
})

userRoutes(app)

app.listen(3000, () => {
  console.log(`Starting app on: ${address}`)
})
