import prisma from "../../../../lib/prisma"

export default async function addBirthdayGift(req, res) {
    const body = req.body
    try {
        const user = await prisma.payBirthday.create({
            data:{
                mainId: body.mainID,
                mainUsername: body.mainUsername,
                subId: body.subId,
                subUsername: body.subUsername,
                date: body.subDOB,
                amount: +body.amount,
            }
        })


        return res.status(200).json({ message: "Success", success: true })
    }
    catch (error) {
        console.log('ERROR', error)
        return res.status(500).json({ error, message: "Failed", success: false })
    }

}