// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import prisma from "../../../../lib/prisma"

export default async function postTransaction(req, res) {

    const body = req.body
    //console.log("BODY", body) 
    try {
        //getting all users
        const allUsernames = await prisma.user.findMany({
            select: {
                username: true
            }
        })

        //getting the toUsername
        let userFound = false
        allUsernames.forEach(i => {
            if (i.username == body.toUsername)
                userFound = true
        })

        if (!userFound) {
            return res.status(500).json({ message: "Username not found", success: false })
        }

        //getting toID from toUsername
        const toID = await prisma.user.findUnique({
            where: {
                username: body.toUsername
            },

            select: {
                id: true
            }

        })

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


        const toUpdate = await prisma.user.update({
            where: {
                id: toID.id
            },
            data: {
                balance: {
                    increment: +body.amount
                }
            }
        })


        const transaction = await prisma.transactions.create({
            data: {
                fromId: body.fromID,
                fromName: body.fromName,
                toName: body.toUsername,
                toId: toID.id,
                amount: +body.amount,
                comment: body.comment,
                type: body.type,
                toBalance: toUpdate.balance,
                fromBalance: req.body.fromID ? fromUpdate.balance : null
            }
        })

        //console.log("transaction", transaction)
        return res.status(200).json({ message: "Success", success: true })
    }
    catch (error) {
        console.log('ERROR', error)
        return res.status(500).json({ error, message: "Failed", success: false })
    }

}