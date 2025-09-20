import { StreamChat } from "stream-chat";
import "dotenv/config";

const apikey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;

if (!apikey || !apiSecret) {
  console.error("Stream API key or Secret is missing");
}

export const streamclient = StreamChat.getInstance(apikey, apiSecret);

export const upsertStreamUse = async (userData) => {
  try {
    await streamclient.upsertUser(userData); // object, not array
    return userData;
  } catch (error) {
    console.error("Error upsertUser Stream user:", error);
    throw error;
  }
};

export const generateStreamToken = (userId) => {
  try {
    return streamclient.createToken(userId.toString());
  } catch (error) {
    console.error("Error generating Stream token:", error);
    throw error;
  }
  
};
