// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import prisma from "../../../lib/prisma"
import { WEB_URL } from "../../../util/keys"

export default async function handleDebits(req, res) {

    const body = req.body
    
    try {

        const debits = await prisma.debits.findMany({})

        debits.forEach(async d => {

            let user = await prisma.user.findUnique({
                where:{
                    id:d.userId
                }
            })

            try {
                let response = await fetch(`${WEB_URL}/api/planetscale/user/postDebitTransaction`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({fromName: user.username, fromID: user.id, toUsername: "Debit Payment", amount: d.monthlyAmount, comment: `Debit payment for ${d.title}`, type: "Bill_Debit" })
                });
               // console.log("INSTs",d.title ,"    ",d.installmentsLeft)
                if(d.installmentsLeft <= 1){

                    let update = await prisma.debits.delete({
                        where:{
                            id: d.id
                        }
                    })
                    console.log("DELETE DEBIT", update)
                } 
                else{
                    let update = await prisma.debits.update({
                        where:{
                            id: d.id
                        },
                        data:{
                            installmentsLeft:{
                                decrement:1
                            }
                        }
                    })
                }
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
        return res.status(200).json({ message: "Success", success: true })
    }
    catch (error) {
        console.log('ERROR', error)
        return res.status(500).json({ error, message: "Failed" })
    }

}