import prisma from "../../../../lib/prisma"

export default async function editPresetBill(req, res) {
    const body = req.body
    
    try {
        let result = null
        switch(body.title){
            case "Water":
                //console.log("we in wawa")
                result = await prisma.bills.update({
                    where:{
                        id: body.id
                    },
                    data:{
                        water: +body.amount,
                        automateWater: body.autoPayment
                    }
                })
                //console.log("WAWA RES", result)
            break;

            case "Electricity":
                //console.log("we in elect")
                result = await prisma.bills.update({
                    where:{
                        id: body.id
                    },
                    data:{
                        electricity: +body.amount,
                        automateElectricity: body.autoPayment
                    }
                })
                //console.log("ELECT RES", result)
            break;

            case "Internet":
                //console.log("we in int")
                result = await prisma.bills.update({
                    where:{
                        id: body.id
                    },
                    data:{
                        internet: +body.amount,
                        automateInternet: body.autoPayment
                    }
                })
                //console.log("INT RES", result)
            break;

        }

        return res.status(200).json({ message: "Success", success: true })
    }
    catch (error) {
        
        return res.status(500).json({ error, message: "Failed", success: false })
    }

}