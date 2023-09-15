// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import prisma from "../../../../lib/prisma"

export default async function getBalance(req, res) {
  const {id} = req.query
  
  try {
    const result = await prisma.user.findUnique({
      where:{
        id: id
      },
      select:{
        balance:true
      }
    })
  

    return res.status(200).json({ balance:result.balance, message: "Success" })
  }
  catch (error) {
    console.log('ERROR', error)
    return res.status(500).json({ error, message: "Failed" })
  }

}