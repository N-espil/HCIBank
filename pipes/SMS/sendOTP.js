export default async function sendOTP(data) {

    try {
        const response = await fetch("/api/SMS/sendOTP", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        if (response.status != 200) {
            console.log("Somthing went wrong!")
            console.log(await response.json())
        }
        else {
            console.log("It was successful")
            return await response.json()
        }

    } catch (error) {
        console.log("There was an error submitting", error)
    }
}