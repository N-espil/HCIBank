import { SNSClient, CreateSMSSandboxPhoneNumberCommand, PublishCommand } from "@aws-sdk/client-sns";

export default async function postSMS(req, res) {
    const body = req.body
    const REGION = process.env.AWS_REGION;
    // console.log("BODY BE", body)
    const phoneNumber = body.phoneNumber
    const client = new SNSClient({ region: REGION });
    const input = { // CreateSMSSandboxPhoneNumberInput
        PhoneNumber: phoneNumber, // required
        LanguageCode: "en-US",
    };

    try {
        const command = new CreateSMSSandboxPhoneNumberCommand(input);
        const response = await client.send(command);
        console.log("RESPONSE ON SENDING OTP", response)
        return res.status(200).json({ response: response, success: true })
    } catch (err) {
        console.log("Error", err);
        return res.status(200).json({ error: err.stack, success: false })

    }
}
