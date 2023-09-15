// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import prisma from "../../../../lib/prisma"


export default async function postManualBillTransaction(req, res) {

    const body = req.body
    console.log("BODY", body)

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
        let update
        switch (body.bill.title) {
            case "Water":
                update = await prisma.bills.update({
                    where: {
                        id: body.bill.id
                    },
                    data: {
                        paidWater: true
                    }
                })
                break;
            case "Electricity":
                update = await prisma.bills.update({
                    where: {
                        id: body.bill.id
                    },
                    data: {
                        paidElectricity: true
                    }
                })
                break;
            case "Internet":
                update = await prisma.bills.update({
                    where: {
                        id: body.bill.id
                    },
                    data: {
                        paidInternet: true
                    }
                })
                break;
            default:
                update = await prisma.customBills.update({
                    where:{
                        id: body.bill.id
                    },
                    data:{
                        paid:true
                    }
                })
            
        }

        return res.status(200).json({ message: "Success", success: true })
    }
    catch (error) {
        console.log('ERROR', error)
        return res.status(500).json({ error, message: "Failed" })
    }

}