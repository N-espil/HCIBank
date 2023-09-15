// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import prisma from "../../../lib/prisma"
import { WEB_URL } from "../../../util/keys"

export default async function handlePresetBills(req, res) {

    const body = req.body
    
    try {

        const bills = await prisma.bills.findMany({})
        // console.log("ALL ALLOWANCES", allowances)

        bills.forEach(async b => {
            let user = await prisma.user.findUnique({where:{ id: b.userId}})
            if (b.automateWater){
                try {
                    let response = await fetch(`${WEB_URL}/api/planetscale/user/postBillTransaction`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({fromName: user.username, fromID: user.id, toUsername: "Water Bill", amount: b.water, comment: `Paying for Water bill`, type: "Bill_Debit" })
                    });

                  //  console.log("WAWA RES", response)
            
                    if (response.status != 200){ 
                        console.log("ERROR")
                    }  
                    else {
                         console.log("It was successful")
                    }
            
                } catch (error) {
                    console.log("There was an error handeling the water bill", error)
                }

            }

            if (b.automateElectricity){
                try {
                    let response = await fetch(`${WEB_URL}/api/planetscale/user/postBillTransaction`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({fromName: user.username, fromID: user.id, toUsername: "Electrecity Bill", amount: b.electricity, comment: `Paying for Electricity bill`, type: "Bill_Debit" })
                    });
                   // console.log("ELECT RES", response)
                    if (response.status != 200){ 
                        console.log("ERROR")
                    }  
                    else {
                         console.log("It was successful")
                    }
            
                } catch (error) {
                    console.log("There was an error handeling the electricity bill", error)
                }

            }
            
            if (b.automateInternet){
                try {
                    let response = await fetch(`${WEB_URL}/api/planetscale/user/postBillTransaction`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({fromName: user.username, fromID: user.id, toUsername: "Internet Bill", amount: b.internet, comment: `Paying for Internet bill`, type: "Bill_Debit" })
                    });
                    //console.log("INT RES", response)
                    if (response.status != 200){ 
                        console.log("ERROR")
                        return await response.json()

                    }  
                    else {
                        // console.log("It was successful")
                         return await response.json()
                    }
            
                } catch (error) {
                    console.log("There was an error handeling the allowance", error)
                }

            }
            

            

        });
        console.log("It was successful")
        return res.status(200).json({ message: "Success", success: true })
    }
    catch (error) {
        console.log('ERROR', error)
        return res.status(500).json({ error, message: "Failed" })
    }

}