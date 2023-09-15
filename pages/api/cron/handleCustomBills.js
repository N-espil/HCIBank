// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import prisma from "../../../lib/prisma"
import { WEB_URL } from "../../../util/keys"

export default async function handleDebits(req, res) {

    const body = req.body

    try {

        const customBills = await prisma.customBills.findMany({})

        customBills.forEach(async b => {
            console.log(b)
            let user = await prisma.user.findUnique({
                where: {
                    id: b.userId
                }
            })
            if (b.automated) {
                try {
                    let response = await fetch(`${WEB_URL}/api/planetscale/user/postBillTransaction`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ fromName: user.username, fromID: user.id, toUsername: "Bill Payment", amount: b.amount, comment: `Bill payment for ${b.title}`, type: "Bill_Debit" })
                    });

                    if (response.status != 200) {
                        console.log("ERROR")
                        return await response.json()
                    }
                    else {
                        console.log("It was successful")
                        return await response.json()
                    }

                } catch (error) {
                    console.log("There was an error handeling the allowance", error)
                }
            }


        });
        return res.status(200).json({ message: "Success", success: true })
    }
    catch (error) {
        console.log('ERROR', error)
        return res.status(500).json({ error, message: "Failed" })
    }

}