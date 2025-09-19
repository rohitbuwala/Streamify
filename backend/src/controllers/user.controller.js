import User from "../models/User.js";
import FriendRequest from "../models/FriendRequest.js";

// ===========================
// Get Recommended Users
// ===========================
export async function getRecommendedUsers(req, res) {
  console.log("Current User in Recommended API ===>", req.user);

  try {
    const currentUserId = req.user.id;
    const currentUser = req.user;

    // DB se users fetch jo:
    // 1️⃣ khud ke id nahi ho
    // 2️⃣ already friend list me nahi ho
    // 3️⃣ onboarded ho
    const recommendedUsers = await User.find({
      $and: [
        { _id: { $ne: currentUserId } },
        { _id: { $nin: currentUser.friends } },
        { isOnboarded: true },
      ],
    }).select(
      "fullName profilePic nativeLanguage learningLanguage location"
    );

    res.status(200).json({
      success: true,
      users: recommendedUsers,
    });
  } catch (error) {
    console.log("Error in getRecommendedUsers", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}

// ===========================
// Get My Friends
// ===========================
export async function getMyFriends(req, res) {
  try {
    const user = await User.findById(req.user.id)
      .select("friends")
      .populate(
        "friends",
        "fullName profilePic nativeLanguage learningLanguage location"
      );

    res.status(200).json(user.friends);
  } catch (error) {
    console.log("Error in getMyFriends controller", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}

// ===========================
// Send Friend Request
// ===========================
export async function sendFriendRequest(req, res) {
  try {
    const myId = req.user.id;
    const { id: recipientId } = req.params;

    console.log("Frontend se aya recipientId:", recipientId);
    console.log("Current user myId:", myId);

    if (!recipientId) {
      return res.status(400).json({ message: "Recipient ID is required" });
    }

    if (myId === recipientId) {
      return res.status(400).json({
        success: false,
        message: "You cannot send a friend request to yourself",
      });
    }

    const recipient = await User.findById(recipientId);
    console.log("Recipient fetched:", recipient);

    if (!recipient) {
      return res.status(400).json({ message: "Recipient not found" });
    }

    // Already sent request check
    const existingRequest = await FriendRequest.findOne({
      sender: myId,
      recipient: recipientId,
      status: "pending",
    });

    if (existingRequest) {
      return res
        .status(400)
        .json({ message: "Friend request already sent" });
    }

    // Already friends check
    if (recipient.friends.some((id) => id.toString() === myId.toString())) {
      return res.status(400).json({ message: "You are already friends" });
    }

    // ✅ Create friend request
    const friendRequest = await FriendRequest.create({
      sender: myId,
      recipient: recipientId,
      status: "pending",
    });

    res.status(201).json({
      message: "Friend request sent successfully",
      friendRequest,
    });
  } catch (error) {
    console.log("Error in sendFriendRequest controller:", error.message);
    res
      .status(500)
      .json({ message: "Internal server error in sendFriendRequest" });
  }
}

// ===========================
// Accept Friend Request
// ===========================
export async function acceptedFriendRequest(req, res) {
  try {
    const { id: requestId } = req.params;
    const friendRequest = await FriendRequest.findById(requestId);

    if (!friendRequest) {
      return res.status(400).json({ message: "Friend request not found" });
    }

    // Verify current user is recipient
    if (friendRequest.recipient.toString() !== req.user.id) {
      return res.status(400).json({
        message: "You are not authorized to accept this request",
      });
    }

    friendRequest.status = "accepted";
    await friendRequest.save();

    // Add each other to friends array
    await User.findByIdAndUpdate(friendRequest.sender, {
      $addToSet: { friends: friendRequest.recipient },
    });

    await User.findByIdAndUpdate(friendRequest.recipient, {
      $addToSet: { friends: friendRequest.sender },
    });

    res.status(200).json({ message: "Friend request accepted successfully" });
  } catch (error) {
    console.log("Error in acceptedFriendRequest controller", error.message);
    res.status(500).json({
      message: "Internal server error in acceptedFriendRequest",
    });
  }
}

// ===========================
// Get Incoming Friend Requests
// ===========================
export async function getFriendRequest(req, res) {
  try {
    const incomingReqs = await FriendRequest.find({
      recipient: req.user.id,
      status: "pending",
    }).populate(
      "sender",
      "fullName profilePic nativeLanguage learningLanguage location"
    );

    const acceptedReqs = await FriendRequest.find({
      recipient: req.user.id,
      status: "accepted",
    }).populate(
      "sender",
      "fullName profilePic nativeLanguage learningLanguage location"
    );

    res.status(200).json({
      message: "Friend requests fetched successfully",
      incomingReqs,
      acceptedReqs,
    });
  } catch (error) {
    console.log("Error in getFriendRequest controller", error.message);
    res.status(500).json({
      message: "Internal server error in getFriendRequest",
    });
  }
}

// ===========================
// Get Outgoing Friend Requests
// ===========================
export async function getOutGoingFriendReqs(req, res) {
  try {
    const outgoingRequests = await FriendRequest.find({
      sender: req.user.id,
      status: "pending",
    }).populate(
      "recipient",
      "fullName profilePic nativeLanguage learningLanguage location"
    );

    res.status(200).json({
      message: "Outgoing friend requests fetched successfully",
      outgoingRequests,
    });
  } catch (error) {
    console.log("Error in getOutGoingFriendReqs controller", error.message);
    res.status(500).json({
      message: "Internal server error in getOutGoingFriendReqs",
    });
  }
}
