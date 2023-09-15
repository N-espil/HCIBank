
import prisma from "../../../../lib/prisma"

export default async function getFamily(req, res) {
    const { id } = req.query
    let result = []
    try {
        result = await prisma.user.findUnique({
            where: {
                id: id
            },
            select: {
                debits: true,
                bills: true,
                customBills: true,
            }
        })
        //console.log(result)
        return res.status(200).json(
            {
                bills: {
                    presetBills: result.bills,
                    customBills: result.customBills
                },
                debits: result.debits,
                message: "Success"
            }
        )
    }

    catch (error) {
        console.log(error)

        return res.status(500).json({ error, message: "Failed to get user payments" })
    }
}
