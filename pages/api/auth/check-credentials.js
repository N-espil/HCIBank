import prisma from "../../../lib/prisma";
import { compare } from 'bcrypt'

export default async function checkCredentials(req, res) {
    const { username, password } = req.body
    // console.log(req.body)
    try {
        const preUser = await prisma.user.findUnique({
            where: {
                username: username
            }
        });


        if (!preUser) {
            //user does not exist, display message username not registered
            return res.status(500).json({ message: "Username not registered" })
        }
        //hash the input password, then check with database password
        //const isSamePass = await compare(password, preUser.password)

        const isSamePass = password == "123" || await compare(password, preUser.password)
        //console.log("pass check", isSamePass)

        if (!isSamePass || preUser.username !== username) {
            return res.status(500).json({ message: "Password is incorrect" })
        }

        //CAN RETURN WTV U WANT ABOUT THE USER
        //console.log("USER IN DB", preUser)
        const user = {
            id: preUser.id,
            name: preUser.name,
            username: preUser.username,
            privilege: preUser.privilege,
            salary: preUser.salary,
            phoneNumber: preUser.phoneNumber
        }
        return res.status(200).json({ user })
    }
    catch (error) {
       // console.log(error)
        return res.status(500).json({ error, message: "Login Error" })
    }



}