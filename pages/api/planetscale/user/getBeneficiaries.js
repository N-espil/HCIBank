
import prisma from "../../../../lib/prisma"

export default async function getBeneficiaries(req, res) {
    const { id } = req.query
    let result = []
    try {
        result = await prisma.user.findUnique({
            where: {
                id: id
            },
            select: {
                beneficiaries: true
            }
        })
         //console.log("benefits",result)


        return res.status(200).json({ beneficiaries: result.beneficiaries, message: "Success" })
    }

    catch (error) {
        console.log(error)

        return res.status(500).json({ error, message: "Failed to get user family" })
    }
}
