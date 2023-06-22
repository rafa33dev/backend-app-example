import  Jwt  from "jsonwebtoken"
import User from "../models/User.js"

export const login = async (email, password) => {
  const user = await User.findOne({
    email: email,
    password: password
  })

  if(!user){
    throw new Error('Credenciales invalidas')
  }

  const token = Jwt.sign(
    {userId: user._id, name: user.name, email: user.email, role: user.role},
    "secret123",
    { expiresIn: "1h"}
    )

    return token
}  