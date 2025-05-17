import User from "../models/User.js";
import FriendRequest from "../models/FriendRequest.js";

export async function getRecommendedUsers(req, res) {

   try {
     const currrentUserId = req.user.id;
     const currentUser = req.user;

     const getRecommendedUsers = await User.find({
        $and: [
            {_id: {$ne: currrentUserId}},
            {_id: {$nin: currentUser.friends}},
            {isOnboarded: true}
        ]
     })
     res.status(200).json({
        success: true,
        getRecommendedUsers,
     })

   } catch (error) {
    console.log("Error in getRecommnededUsers", error.message)
   }


}

export async function getMyFriends (req, res) {

   try {
     const user = await User.findById(req.user.id).select("friends")
     .populate("friends", "fullName  profilePic nativeLanguage learningLanguage" )

     res.status(200).json(user.friends)
   } catch (error) {
    console.log("Error in getMyFriends controller", error.message)

    res.status(500).json({message: "Internal server error"})
   }
}

export async function sendFriendRequest(req, res){

   try {
      const myId =req.user.id;
      const{ id: recipientId } = req.params;

      // prevent sending request to yourself
      if(myId === recipientId){
         return res.status(400).json({
            success: false,
            message: "You cannot send a friend request to yourself"
         })
      }
      const recipient = await User.findById(recipientId);
      if(!recipient){
         return res.status(400).json({meassage: "recipient not found"})
      }

      // check if the User is already a friend
      if(recipient.friends.includes(myId)){
         return res.status(400).json({
            success: false,
            message: "You are already friends with this user"
         })
      }

      //check if the request is already exists
      const existingRequest = await FriendRequest.findOne({
         $or: [
            {  sender: myId, recipient:recipientId },
            { sender: recipientId, recipient: myId }
         ]
      })

      if(existingRequest){
         return res.status(400).json({message: "A friend request already exists"})
      }

      // create a new friend request
      const friendRequest  = await FriendRequest.create({
         sender: myId,
         recipient: recipientId
      })

      res.status(200).json(friendRequest);
   } catch (error) {
      console.log("Error in sendFriendRequest controller", error.message)
      res.status(500).json({message: "Internal server error in sendFriendRequest"})
   }
}

export async function acceptedFriendRequest(req, res) {
   try {
      const { id: requestId} =req.params;
      const friendRequest = await FriendRequest.findById(requestId);
      if(!friendRequest) {
         return res.status(400).json({meassage: "Friend request not found"})
      }

      // verify the current user is the recipient 
      if(friendRequest.recipient.toString() !== req.user.id){
         return res.status(400).json({message: "You are not authorized to accept this request"})
      }

      friendRequest.status = "accepted";
      await friendRequest.save();

      //add each user to the other's friends array
      await User.findByIdAndUpdate(friendRequest.sender, {
         $addToSet: { friends: friendRequest.recipient}
      })

      await User.findByIdAndUpdate(friendRequest.recipient, {
         $addToSet: {friends: friendRequest.sender}
      });

      res.status(200).json({message:  "Friend request accepted successfully"})
   } catch (error) {
      console.log("Error in acceptedFriendRequest controller", error.message)
      res.status(500).json({message: "Internal server error in acceptedFriendRequest"})
   }
}

export async function getFriendRequest(req, res){
   try {
      const incomingReqs  = await FriendRequest.find({
         recipient: req.user.id,
         status: "pending",
      }).populate("sender", "fullName profilePic nativeLanguage learningLanguage") ;
      
      const acceptedReqs = await FriendRequest.find({
         recipient: req.user.id,
         status: accepted 
      }).populate("sender", "fullName profilePic");

      res.status(200).json({message: "Friend requests fetched successfully", incomingReqs, acceptedReqs})
   } catch (error) {
      console.log("Error in getFriendRequest controller", error.message)
      res.status(500).json({message: "Internal server error in getFriendRequest"})
   }
}

export async function getOutGoingFriendReqs(req, res){
   try {
      const outgoingRequests = await FriendRequest.find({
         sender: req.user.id,
         status: pending
      }).populate("recipient", "fullName profilePic nativeLanguage learningLanguage");
      res.status(200).json({message: "Outgoing friend requests fetched successfully", outgoingRequests})
      
   } catch (error) {
      console.log("Error in getOutGoingFriendReqs controller", error.message)
      res.status(500).json({message: "Internal server error in getOutGoingFriendReqs"})
   }
}