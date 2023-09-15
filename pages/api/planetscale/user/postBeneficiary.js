// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import prisma from "../../../../lib/prisma"

export default async function postBeneficiary(req, res) {

    const body = req.body
    //console.log("BODY", body) 
    try {
        
        //getting toID from toUsername
        const ben = await prisma.user.findUnique({
            where: {
                username: body.beneficiaryUsername
            },

            select: {
                id: true,
                name: true
            }

        })
        //console.log("BEN", ben)
        
        const newBeneficiary = await prisma.beneficiary.create({
            data: {
                userId: body.userId,
                beneficiaryId: ben.id,
                beneficiaryUsername:body.beneficiaryUsername,
                beneficiaryName: ben.name
            }
        })

        //console.log("transaction", transaction)
        return res.status(200).json({ message: "Success", success: true })
    }
    catch (error) {
        console.log('ERROR', error)
        return res.status(500).json({ error, message: "Failed" })
    }

}