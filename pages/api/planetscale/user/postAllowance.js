// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import prisma from "../../../../lib/prisma"

export default async function postAllowance(req, res) {

    const body = req.body
    
    try {

        const allowance = await prisma.allowance.create({
            data: {
                mainId: body.mainId,
                subId: body.subId,
                amount: +body.amount,
            }
        })

        return res.status(200).json({ message: "Success", success: true })
    }
    catch (error) {
        console.log('ERROR', error)
        return res.status(500).json({ error, success: false })
    }

}