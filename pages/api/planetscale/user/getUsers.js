// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import prisma from "../../../../lib/prisma"

export default async function getUsers(req, res) {

  try {
    const users = await prisma.user.findMany()
   // console.log("USERS", users)
    return res.status(200).json({ users, message: "Success" })
  }
  catch (error) {
    console.log('ERROR', error)
    return res.status(500).json({ error, message: "Failed" })
  }

}