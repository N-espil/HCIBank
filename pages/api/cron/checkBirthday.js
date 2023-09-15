import prisma from "../../../lib/prisma"

export default async function checkBirthday(req, res) {
    try {
        let users = await prisma.user.findMany({
            where: {
                privilege: 'MAIN'
            },
            select: {
                id: true,
                username: true,
                subUser: {
                    select: {
                        id: true,
                        dateOfBirth: true,
                        username: true,
                        name: true
                    }
                }
            }
        });

        users = users.filter((i) => i.subUser.length != 0)
        //console.log("USERS", users)

        let currentDate = new Date();
        let year = currentDate.getFullYear();
        let month = String(currentDate.getMonth() + 1).padStart(2, '0');
        let day = String(currentDate.getDate()+ 2).padStart(2, '0');
        currentDate = `${month}-${day}`;



        for (const user of users) {
            console.log("USER", user.username)
            user.subUser.forEach(async (sub) => {
                let subDOB = sub.dateOfBirth.substring(5)
                //console.log("BEFORE", subDOB)
                let [month, day] = subDOB.split('-');
                let dateObj = new Date(`2023-${month}-${day}`);

                // Add two days
                dateObj.setDate(dateObj.getDate());

                // Format the output date string
                let outputMonth = String(dateObj.getMonth() + 1).padStart(2, '0');
                let outputDay = String(dateObj.getDate()).padStart(2, '0');
                subDOB = `${outputMonth}-${outputDay}`;
                console.log("CRR", currentDate, "subDOB", subDOB)
                if (currentDate === subDOB) {
                    const result = await prisma.birthdayVoucherNotification.create({
                        data:{
                            mainId: user.id,
                            subId: sub.id,
                            subDateOfBirth: sub.dateOfBirth,
                            subUsername: sub.username,
                            subName: sub.name
                        }
                    })

                    console.log("RESULT", result)
                }
            })

        }

        console.log('Success.');
        return res.status(200).json({ users, message: "success" })
    } catch (error) {
        console.error('Failed.', error);
        return res.status(500).json({ message: "false" })
    }
}
//'0 0 1 * *' cron expression for once per month