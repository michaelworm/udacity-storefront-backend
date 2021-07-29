import jwt, {Secret} from "jsonwebtoken"
import {User} from "../models/user"

const SECRET = process.env.TOKEN_SECRET as Secret

export function getTokenByUser (user: User) {
  return jwt.sign({ user }, SECRET);
}

export function checkAuthHeader (authHeaders: string) {
  if (!authHeaders) {
    return false
  }

  try {
    const token = authHeaders.split(" ")[1]

    jwt.verify(token, SECRET)

    return true
  } catch (err) {
    console.error(err)

    return false
  }
}
