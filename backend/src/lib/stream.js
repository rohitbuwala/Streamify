    import {StreamChat} from "stream-chat";
    import "dotenv/config";

    const apikey = process.env.STREA_API_KEY ;
    const apiSecret = process.env.STREA_API_SECRET;

    if(!apikey || !apiSecret) {
        console.error("Stream api key or Secret is missing ")

    }

    export const streamclient = StreamChat.getInstance(apikey, apiSecret);

    export const upsertStreamUse = async (userData) => {
        try {
            await streamclient.upsertUser([userData])
            return userData ;
        } catch (error) {
            console.error("Error upsertUser Stream user: " , error)
        }
    }