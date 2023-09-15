import  { SNSClient } from "@aws-sdk/client-sns";
import {PublishCommand } from "@aws-sdk/client-sns";

export default async function postSMS(req, res){
    const {PhoneNumber, password} = req.body
    const REGION = process.env.AWS_REGION;    // Create SNS service object.
    const snsClient = new SNSClient({ region: REGION });
    
    var params = {
      Message: `Welcome to the HCIBank, you password is: ${password}` , // MESSAGE_TEXT
      PhoneNumber: PhoneNumber, //PhoneNumber
    };

    try {
      const data = await snsClient.send(new PublishCommand(params));
      console.log("Success SENDING SMS.",  data);
      return res.status(200).json({ data: data, success: true })
    } catch (err) {
      console.log("Error", err.stack);
      return res.status(200).json({ error: err.stack, success: false })

    }
}
