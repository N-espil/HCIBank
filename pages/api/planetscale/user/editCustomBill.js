import prisma from "../../../../lib/prisma"

export default async function editCustomBill(req, res) {
    const body = req.body
    
    try {
    
        const result = await prisma.customBills.update({
            where: {
               id: body.id
            },
            data: {
                amount: +body.amount,
                automated: body.autoPayment
            }
        })
        return res.status(200).json({ message: "Success", success: true })
    }

    catch (error) {

        return res.status(500).json({ error, message: "Failed", success: false })
    }

}