// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import prisma from "../../../lib/prisma"
import { WEB_URL } from "../../../util/keys"

export default async function handleAllowance(req, res) {

    const body = req.body
    
    try {

        const allowances = await prisma.allowance.findMany({})
        // console.log("ALL ALLOWANCES", allowances)

        allowances.forEach(async e => {

            let mainUser = await prisma.user.findUnique({
                where:{
                    id:e.mainId
                }
            })
            // console.log("MAIN USER", mainUser)
            let subUser = await prisma.user.findUnique({
                where:{
                    id:e.subId
                }
            })

            // console.log("SUB USER", subUser)

            try {
                let response = await fetch(`${WEB_URL}/api/planetscale/user/postTransaction`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({fromName: mainUser.username, fromID: mainUser.id, toUsername: subUser.username, amount: e.amount, comment: `Allowance for ${subUser.name}`, type: "Allowance" })
                });
        
                if (response.status != 200){ 
                    console.log("ERROR")
                    return await response.json()
                }  
                else {
                     console.log("It was successful")
                    return await response.json()
                }
        
            } catch (error) {
                console.log("There was an error handeling the allowance", error)
            }
        });
        console.log("It was successful")
        return res.status(200).json({ message: "Success", success: true })
    }
    catch (error) {
        console.log('ERROR', error)
        return res.status(500).json({ error, message: "Failed" })
    }

}