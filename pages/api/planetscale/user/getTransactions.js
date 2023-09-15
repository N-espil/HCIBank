
import prisma from "../../../../lib/prisma"

export default async function getTransactions(req, res) {
  let { id, privilege } = req.query

  let mainUser

 // console.log("ID AFT", id)
  //main transactions
  let result1 = []
  try {
    const toResult = await prisma.transactions.findMany({
      where: {
        toId: id
      },

    })

    const fromResult = await prisma.transactions.findMany({
      where: {
        fromId: id
      },

    })

    result1 = result1.concat(toResult, fromResult)

    //console.log("API MAIN TRAN", result1)
  }
  catch (error) {
    return res.status(500).json({ error, message: "Failed to get user transactions" })
  }

  //sub transcations
  if (privilege == "MAIN2") {
    mainUser = await prisma.user.findUnique({
      where: {
        id: id
      },
      select: {
        mainUser: true
      }
    })
    //console.log("MAIN2", mainUser)

    id = mainUser.mainUser.id
  }

  let result2 = []
  try {
    //get all sub users id
    if (privilege == "MAIN") {
      const test = await prisma.user.findUnique({
        where: {
          id: id
        },
        select: {
          subUser: {
            select: {
              id: true
            }
          }
        }
      })

      const allSubUsers = test.subUser.map(item => Object.values(item)).flat();
      //console.log("SUB USES", allSubUsers)
      for (let i = 0; i < allSubUsers.length; i++) {
        let subId = allSubUsers[i]
        let toResult = await prisma.transactions.findMany({
          where: {
            toId: subId
          },

        })

        let fromResult = await prisma.transactions.findMany({
          where: {
            fromId: subId
          },

        })
        result2 = result2.concat(toResult, fromResult)
        // console.log("res2 each", result2)
      }


    }
    else if (privilege == "MAIN2") {
      const test = await prisma.user.findUnique({
        where: {
          id: id
        },
        select: {
          subUser: {
            select: {
              id: true,
              privilege: true
            }
          }
        }
      })
      
      let allSubUsers = test.subUser.filter(i => i.privilege != "MAIN2")
      allSubUsers = allSubUsers.map(item => item.id)
      

      for (let i = 0; i < allSubUsers.length; i++) {
        let subId = allSubUsers[i]
        let toResult = await prisma.transactions.findMany({
          where: {
            toId: subId
          },

        })

        let fromResult = await prisma.transactions.findMany({
          where: {
            fromId: subId
          },

        })
        result2 = result2.concat(toResult, fromResult)
        // console.log("res2 each", result2)
      }
    }
    const mainTransactions = result1 || []
    const subTransactions = result2 || []

    if (result2.length === 0) {
      return res.status(200).json({ Transactions: { mainTransactions, subTransactions: [] }, message: "Success main only" })
    }
    return res.status(200).json({ Transactions: { mainTransactions, subTransactions }, message: "Success" })
  }
  catch (error) {
    console.log('ERROR2', error)
    return res.status(500).json({ error, message: "Failed" })
  }

}