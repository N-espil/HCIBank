
import prisma from "../../../../lib/prisma"

export default async function getBills(req, res) {
    const { id } = req.query
    let result = []
    try {
        result = await prisma.bills.findUnique({
            where: {
                userId: id
            },
            select:{
                electricity: true,
                water: true,
                internet: true,
                automateElectricity: true,
                automateWater: true,
                automateInternet: true,
                paidElectricity: true,
                paidWater: true,
                paidInternet: true,
                id: true
            }
        })


        return res.status(200).json({ bills: result, message: "Success" })
    }

    catch (error) {
        console.log(error)

        return res.status(500).json({ error, message: "Failed to get user family" })
    }
}
