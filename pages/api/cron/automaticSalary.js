import prisma from "../../../lib/prisma"
import { WEB_URL } from "../../../util/keys"
export default async function automaticSalary(req, res) {
    try {
        const users = await prisma.user.findMany({
            where: {
                privilege: 'MAIN'
            }
        });

        users.forEach(async (user) => {
            try {
                let response = await fetch(`${WEB_URL}/api/planetscale/user/postTransaction`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ fromName: "Work", toUsername: user.username, amount: 7000, comment: `Monthly Salary`, type: "Receiving" })
                });

                if (response.status != 200)
                    return await response.json()
                else {
                    // console.log("It was successful")
                    return await response.json()
                }

            } catch (error) {
                console.log("There was an error handling the auto salary", error)
            }
        })
        return res.status(200).json({ message: "success" })
    }
    catch (error) {
        console.error('Automatic monthly salary processing failed:', error);
        return res.status(500).json({ message: "false" })
    }
}
//'0 0 1 * *' cron expression for once per month
/*
{
    "path": "/api/cron/checkBirthday",
    "schedule": "0 0 * * *"
},
{
    "path": "/api/cron/handlePresetBills",
    "schedule": "0 0 1 * *"
},
{
    "path": "/api/cron/handleDebits",
    "schedule": "0 0 1 * *"
},
{
    "path": "/api/cron/handleCustomBills",
    "schedule": "0 0 1 * *"
},
{
    "path": "/api/cron/handleBirthday",
    "schedule": "0 0 * * *"
}
        // {
        //     "path": "/api/cron/handleAllowances",
        //     "schedule": "0 0 1 * *"
        // }*/