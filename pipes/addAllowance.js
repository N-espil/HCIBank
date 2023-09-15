
export default async function addAllowance(data) {
    try {
        const response = await fetch("/api/planetscale/user/postAllowance", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        if (response.status != 200) 
            return await response.json()  
        else {
            console.log("It was successful")
            return await response.json()
        }

    } catch (error) {
        console.log("There was an error submitting", error)
    }
}