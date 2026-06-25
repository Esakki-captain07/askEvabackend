import bcrypt from 'bcrypt'
import 'dotenv/config.js'
import jwt from 'jsonwebtoken'


export const hashPassword = (userPassword) => {
    try {

        let hashedPassword = bcrypt.hash(userPassword, Number(process.env.SALT || 10))
        console.log(hashedPassword)
        return hashedPassword

    } catch (err) {
        console.log(err)
    }
}

export const decodePassword = (userPassword, hashPassword) => {
    try {
        console.log(userPassword, hashPassword)

        let decodePassword = bcrypt.compare(userPassword, hashPassword)
        return decodePassword

    } catch (err) {
        console.log(err)
    }
}

export const createToken = (payload) => {
    console.log(payload)
    const token = jwt.sign(payload, process.env.SERECY_KEY, { expiresIn: '1D' })
    return token
}

export const verifyToken = async (token) => {
    try {
        const decodedToken = jwt.verify(token, process.env.SERECY_KEY);
        return decodedToken;

    } catch (error) {
        throw error
    }
}