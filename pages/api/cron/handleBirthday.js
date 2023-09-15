import prisma from "../../../lib/prisma"
import { WEB_URL } from "../../../util/keys";

export default async function handleBirthday(req, res) {
    try {
        const scheduledBirthdays = await prisma.payBirthday.findMany({})


        //console.log("USERS", users)

        let currentDate = new Date();
        let year = currentDate.getFullYear();
        let month = String(currentDate.getMonth() + 1).padStart(2, '0');
        let day = String(currentDate.getDate()).padStart(2, '0');
        currentDate = `${month}-${day}`;

        for (const i of scheduledBirthdays) {


            let subDOB = i.date.substring(5)
            //console.log("BEFORE", subDOB)
            let [month, day] = subDOB.split('-');
            let dateObj = new Date(`2023-${month}-${day}`);

            // Format the output date string
            let outputMonth = String(dateObj.getMonth() + 1).padStart(2, '0');
            let outputDay = String(dateObj.getDate()).padStart(2, '0');
            subDOB = `${outputMonth}-${outputDay}`;
            console.log("CRR", currentDate, "subDOB", subDOB)


            if (currentDate === subDOB) {
                try {
                    let response = await fetch(`${WEB_URL}/api/planetscale/user/postTransaction`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ fromID: i.mainId, fromName: i.mainUsername, toUsername: i.subUsername, amount: i.amount, comment: `Birthday Gift for ${i.subUsername}`, type: "Receiving" })
                    });

                    if (response.status != 200)
                        console.log("It was not successful", await response.json())
                    //return await response.json()
                    else {
                        const update = await prisma.payBirthday.delete({
                            where: {
                                id: i.id
                            }
                        })
                        console.log("It was successful", await response.json())
                        //return await response.json()
                    }


                } catch (error) {
                    console.log("There was an error handling the birthday payment", error)
                }

                //console.log("RESULT", result)
            }


        }

        console.log('Success.');
        return res.status(200).json({ message: "success" })
    } catch (error) {
        console.error('Failed.', error);
        return res.status(500).json({ message: "false" })
    }
}
//'0 0 1 * *' cron expression for once per month