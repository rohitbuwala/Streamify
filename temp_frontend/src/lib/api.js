import { axiosInstance } from "./axios";

// 🔹 Auth APIs
export const signup = async (signupData) => {
  const response = await axiosInstance.post("/auth/signup", signupData);
  return response.data;
};

export const login = async (loginData) => {
  const response = await axiosInstance.post("/auth/login", loginData);
  return response.data;
};

export const logout = async () => {
  const response = await axiosInstance.post("/auth/logout");
  return response.data;
};

export const getAuthUser = async () => {
  try {
    const res = await axiosInstance.get("/auth/me");
    return res.data;
  } catch (error) {
    console.error("Error in getAuthUser:", error);
    return null;
  }
};

export const completeOnboarding = async (userData) => {
  const response = await axiosInstance.post("/auth/onboarding", userData);
  return response.data;
};

// 🔹 User APIs
export const getUserFriends = async () => {
  const response = await axiosInstance.get("/users/friends");
  return response.data; // already array
};

export const getRecommendedUsers = async () => {
  const response = await axiosInstance.get("/users");
  return response.data.users || []; // ✅ fix
};

export const getOutgoingFriendReqs = async () => {
  const response = await axiosInstance.get("/users/outgoing-friend-requests");
  return response.data.outgoingRequests || []; // ✅ fix
};

export const getFriendRequests = async () => {
  const response = await axiosInstance.get("/users/friend-requests");
  return {
    incomingReqs: response.data.incomingReqs || [],
    acceptedReqs: response.data.acceptedReqs || [],
  };
};


export const sendFriendRequest = async (userId) => {
  const response = await axiosInstance.post(`/users/friend-request/${userId}`);
  return response.data.friendRequest; // ✅ fix
};

export const acceptFriendRequest = async (requestId) => {
  const response = await axiosInstance.put(
    `/users/friend-request/${requestId}/accept`
  );
  return response.data;
};

// 🔹 Chat APIs
export const getStreamToken = async () => {
  const response = await axiosInstance.get("/chat/token");
  return response.data;
};

