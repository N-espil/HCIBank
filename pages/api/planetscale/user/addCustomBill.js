import prisma from "../../../../lib/prisma"

export default async function addCustomBill(req, res) {
    const body = req.body
    try {
        const user = await prisma.customBills.create({
            data:{
                userId: body.userId,
                title: body.title,
                amount: +body.amount,
                automated: body.autoPayment
            }
        })
        return res.status(200).json({ message: "Success", success: true })
    }
    catch (error) {
        console.log('ERROR', error)
        return res.status(500).json({ error, message: "Failed", success: false })
    }

}