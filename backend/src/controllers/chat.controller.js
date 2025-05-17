import User from "../models/User";

export async function getStreamToken(req, res) {
    try {
        const token = generateStreamToken(req.user.id)
        res.status(200).json({token})


    } catch (error) {
        console.log("Error in getStreamToken controller  ", error);
    }
}