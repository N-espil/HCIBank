// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import prisma from "../../../../lib/prisma"

export default async function postNFCTransaction(req, res) {

    const body = req.body
    try {
        
        let fromUpdate = null
        if (req.body.fromID) {
            fromUpdate = await prisma.user.update({
                where: {
                    id: req.body.fromID
                },
                data: {
                    balance: {
                        decrement: +body.amount
                    }
                }
            })
        }




        const transaction = await prisma.transactions.create({
            data: {
                fromId: body.fromID,
                fromName: body.fromName,
                toName: body.toUsername,
                amount: +body.amount,
                comment: body.comment,
                type: body.type,
                fromBalance: req.body.fromID ? fromUpdate.balance : null
            }
        })

        return res.status(200).json({ message: "Success", success: true })
    }
    catch (error) {
        console.log('ERROR', error)
        return res.status(500).json({ error, message: "Failed" })
    }

}