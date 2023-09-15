import { SNSClient, VerifySMSSandboxPhoneNumberCommand , PublishCommand } from "@aws-sdk/client-sns";

export default async function postSMS(req, res) {
    const body = req.body
    const REGION = process.env.AWS_REGION;
    const phoneNumber = body.phonenumber
    const OTP = body.OTP
    const client = new SNSClient({ region: REGION });
    const input = { // VerifySMSSandboxPhoneNumberInput
        PhoneNumber: "+971" + phoneNumber, // required
        OneTimePassword: OTP, // required
    };

    try {
        const command = new VerifySMSSandboxPhoneNumberCommand(input);
        const response = await client.send(command);
        console.log("RES", response)
        return res.status(200).json({ response: response, success: true })
    } catch (err) {
        console.log("Error", err.stack);
        return res.status(200).json({ error: err.stack, success: false })

    }
}