// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import prisma from "../../../../lib/prisma"

export default async function getUsers(req, res) {
const body = req.body
//console.log("BODY", body)
  try {
    const firstUpdate = await prisma.user.update({
        where:{
            id: body.subId
        },
        data:{
            name: body.name
        }
    })

    let secondUpdate;
    if(body?.allowance){
    secondUpdate = await prisma.allowance.update({
        where:{
            mainId_subId: {mainId: body.mainId, subId: body.subId}
        },
        data:{
            amount: +body.allowance,
        }
    })
  }
   
    return res.status(200).json({ message: "Success", success: true })
  }
  catch (error) {
    console.log('ERROR', error)
    return res.status(500).json({ error, message: "Failed", success:false })
  }

}