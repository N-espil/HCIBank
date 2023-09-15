import prisma from "../../../lib/prisma"
import { WEB_URL } from "../../../util/keys"
export default async function clearPayments(req, res) {
    try {
        let update = await prisma.bills.updateMany({
            data:{
                paidElectricity: false,
                paidInternet: false,
                paidWater: false
            }
        })

        update = await prisma.customBills.updateMany({
            data:{
                paid:false
            }
        })

        return res.status(200).json({ message: "success" })
    }
    catch (error) {
        console.error('Clearing payments error', error);
        return res.status(500).json({ message: "false" })
    }
}
//'0 0 1 * *' cron expression for once per month