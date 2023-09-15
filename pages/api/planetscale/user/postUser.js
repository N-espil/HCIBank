import { PrismaClient } from "@prisma/client";
import postSMS from "../../SMS/sendSMS";
import { WEB_URL } from "../../../../util/keys";

const bcrypt = require("bcrypt");

function generateCreditCardNumber() {
    let ccNumber = '';
    for (let i = 0; i < 16; i++) {
        ccNumber += Math.floor(Math.random() * 10);
    }
    return ccNumber;
}

function generatePassword() {
    let charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let password = '';
    for (let i = 0; i < 6; i++) {
        let randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
    }
    return password;
}

async function hashPass(unHashPass) {
    return bcrypt.hash(unHashPass, 15).then((hash) => hash)
}


//Send sms of the password later!!
export default async function postUser(req, res) {
    const prisma = new PrismaClient();
    const body = req.body
    const unHashedPass = generatePassword()

    const hashedPass = await hashPass(unHashedPass)
    let creditCard = ''

    if (body?.mainID) {
        //add dependent case
        creditCard = await prisma.user.findUnique({
            where: {
                id: body.mainID
            },
            select: {
                creditCard: true
            }
        })
    }
    else {
        //new user case
        let allCreditCardNumber = await prisma.user.findMany({
            select: {
                creditCard: true
            }
        })

        allCreditCardNumber = allCreditCardNumber.map(obj => Object.values(obj)).flat();
        do {
            creditCard = generateCreditCardNumber()
        } while (allCreditCardNumber.includes(creditCard));

    }
    let prev = ""

    if (body?.privilege == "Sub")
        prev = "SUB"
    else if (body?.privilege == "Main")
        prev = "MAIN"
    else if (body?.privilege == "Main2")
        prev = "MAIN2"

    try {
        const newUser = await prisma.user.create({
            data: {
                name: body.name,
                username: body.username,
                phoneNumber: body.phoneNumber,
                dateOfBirth: body.dob,
                mainID: body?.mainID || null,
                privilege: prev,
                creditCard: creditCard.creditCard,
                password: hashedPass
            }
        });
        let payments
        if (body?.privilege == "Main" || body?.privilege == "Main2")
            payments = await prisma.bills.create({
                data: {
                    userId: newUser.id,
                }
            })

        if (body?.privilege == "Main" && body?.OTP){
            try {
                const response = await fetch(`${WEB_URL}/api/SMS/sendSMS`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({PhoneNumber: body.phoneNumber, password:unHashedPass })
                });
        
                if (response.status != 200) {
                    console.log("Somthing went wrong!")               
                }
                else {
                    console.log("It was successful")
                }
        
            } catch (error) {
                console.log("There was an error submitting", error)
            }
        }
        return res.status(200).json({ message: "User Added", success: true })

    }
    catch (error) {
        console.log("Request Error", error)
        return res.status(500).json({ error: "Error adding user", success: false })
    }

}


