import prisma from "../../../../lib/prisma"

export default async function deleteUser(req, res) {
    try {
        const user = await prisma.user.delete({
            where: {
                id: req.body.id, 
                
            }
        })
        return res.status(200).json({ message: "Success", success: true })
    }
    catch (error) {
        console.log('ERROR', error)
        return res.status(500).json({ error, message: "Failed", success: false })
    }

}