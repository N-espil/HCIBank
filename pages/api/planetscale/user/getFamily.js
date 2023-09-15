
import prisma from "../../../../lib/prisma"

export default async function getFamily(req, res) {
    const { id } = req.query
    let result = []
    try {
        let user = null
        try {
            
             user = await prisma.user.findUnique({
                where: {
                    id: id
                }
            })
        } catch (error) {
            return res.status(500).json({ error, message: "block 0" })

        }

        //console.log("USER", user)

        if (user.privilege == "MAIN") {
           // console.log("INSIDE MAIN", user)
            try {
                result = await prisma.user.findUnique({
                    where: {
                        id: id
                    },
                    select: {
                        subUser: {
                            select: {
                                name: true,
                                username: true,
                                id: true,
                                balance: true,
                                privilege: true,
                                dateOfBirth: true,
                            }
                        }
                    }
                })

            } catch (error) {
                return res.status(500).json({ error, message: "block 1" })
            }

            let subUsers = result.subUser
            try {

                subUsers = await Promise.all(subUsers.map(async (sub) => {
                    let temp = await prisma.allowance.findUnique({
                        where: {
                            mainId_subId: {
                                mainId: id,
                                subId: sub.id
                            }
                        },
                        select: {
                            amount: true
                        }
                    })
                    if (temp)
                        return { ...sub, allowance: temp.amount }

                    return { ...sub, allowance: null }

                }))
            } catch (error) {
                return res.status(500).json({ error, message: "block 2" })

            }
            return res.status(200).json({ subUsers: subUsers, message: "Success" })

        }
        else {
            try {

                result = await prisma.user.findUnique({
                    where: {
                        id: id
                    },
                    select: {
                        mainUser: {
                            select: {
                                name: true,
                                username: true,
                                id: true,
                                balance: true,
                                privilege: true,
                                dateOfBirth: true,
                            }
                        }
                    }

                })
            } catch (error) {
                return res.status(500).json({ error, message: "block 3" })
            }
            
            let mainUser = [result.mainUser]
            try {

                let result2 = await prisma.user.findUnique({
                    where: {
                        id: result.mainUser.id
                    },
                    select: {
                        subUser: {
                            select: {
                                name: true,
                                username: true,
                                id: true,
                                balance: true,
                                privilege: true,
                                dateOfBirth: true,
                            }
                        }
                    }
                })
                //console.log("RES2 BE", result2)

                if (result2.subUser.length != 0) {
                    result2.subUser.forEach((e) => {
                        if (e.id != user.id)
                            mainUser.push(e)
                    });
                }
            } catch (error) {
                return res.status(500).json({ error, message: "block 4" })
            }
            // console.log("HERE", result)

            //console.log("MAIN USERS", mainUser)
            return res.status(200).json({ subUsers: mainUser, message: "Success" })
        }

    }

    catch (error) {
        return res.status(500).json({ error, message: "Failed to get user family" + error })
    }
}
