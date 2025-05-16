import User from "../models/User.js";


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