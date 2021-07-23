import express, {Application, Request, Response} from "express"
import bodyParser from "body-parser"

const app: Application = express()
const address: string = "127.0.0.1:3000"

app.use(bodyParser.json())

app.get("/", function (req: Request, res: Response) {
  res.send("Hello World!")
})

app.listen(3000, function () {
  console.log(`starting app on: ${address}`)
})
