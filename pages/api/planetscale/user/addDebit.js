import prisma from "../../../../lib/prisma"

export default async function addDebit(req, res) {
    const body = req.body
    console.log("BODY", body)
    try {
        const user = await prisma.debits.create({
            data:{
                userId: body.userId,
                title: body.title,
                totalAmount: +body.totalAmount,
                dateDue: body.dateDue,
                monthlyAmount: +body.monthlyAmount,
                installmentsLeft: +body.installmentsLeft
            }
        })
        return res.status(200).json({ message: "Success", success: true })
    }
    catch (error) {
        console.log('ERROR', error)
        return res.status(500).json({ error, message: "Failed", success: false })
    }

}