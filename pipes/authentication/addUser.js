
export default async function addUser(data) {

    try {
        const response = await fetch("/api/planetscale/user/postUser", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        if (response.status != 200) {
            console.log("Somthing went wrong!")
            return await response.json()
        }
        else {
            console.log("It was successful")
            return await response.json()
        }

    } catch (error) {
        console.log("There was an error submitting", error)
    }
}