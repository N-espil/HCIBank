
import prisma from "../../../../lib/prisma"

export default async function getPaidBirthdays(req, res) {
    const { id } = req.query
    let paidSubs = []
    try {
        const result = await prisma.payBirthday.findMany({ })
        
        result.forEach((r)=>{
            if (r.mainId == id)
                paidSubs.push(r)
        })

       // console.log("PAID SUBS", paidSubs)
        return res.status(200).json({ paidSubs, message: "Success" })
    }

    catch (error) {
        return res.status(500).json({ error, message: "Failed to get user family" })
    }
}
