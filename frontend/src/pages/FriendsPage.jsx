// // src/pages/FriendsPage.jsx
// import { useQuery } from "@tanstack/react-query";
// import { getUserFriends } from "../lib/api.js";   // ✅ ye named export hai

// import { Loader2 } from "lucide-react";

// export default function FriendsPage() {
//   const { data, isLoading, isError } = useQuery({
//     queryKey: ["friends"],
//     queryFn: getUserFriends,   // ✅ direct function use karenge
//   });

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
//       </div>
//     );
//   }

//   if (isError) {
//     return <p className="text-center text-red-500">Failed to load friends</p>;
//   }

//   if (!data || data.length === 0) {
//     return <p className="text-center text-gray-500">You don’t have any friends yet 😅</p>;
//   }

//   return (
//     <div className="max-w-2xl mx-auto p-4">
//       <h1 className="text-2xl font-bold mb-4">Your Friends</h1>
//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//         {data.map((friend) => (
//           <div
//             key={friend._id}
//             className="flex items-center gap-3 border rounded-xl p-3 shadow-sm hover:shadow-md transition"
//           >
//             <img
//               src={friend.profilePic || "/avatar.png"}
//               alt={friend.fullName}
//               className="w-12 h-12 rounded-full object-cover"
//             />
//             <div>
//               <h2 className="font-semibold">{friend.fullName}</h2>
//               <p className="text-sm text-gray-600">
//                 {friend.nativelanguage} → {friend.learninglanguage}
//               </p>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }


// src/pages/FriendsPage.jsx
import { useQuery } from "@tanstack/react-query";
import { getUserFriends } from "../lib/api.js"; // ✅ named export
import { Loader2, MessageSquare } from "lucide-react";

export default function FriendsPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (isError) {
    return <p className="text-center text-red-500">Failed to load friends</p>;
  }

  if (!data || data.length === 0) {
    return (
      <p className="text-center text-gray-500">
        You don’t have any friends yet 😅
      </p>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Your Friends</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {data.map((friend) => (
          <div
            key={friend._id}
            className="flex flex-col items-center gap-3 border rounded-2xl p-5 shadow-sm hover:shadow-lg transition bg-white"
          >
            {/* Profile Picture */}
            <img
              src={friend.profilePic || "/avatar.png"}
              alt={friend.fullName}
              className="w-20 h-20 rounded-full object-cover border"
            />

            {/* Name & Languages */}
            <div className="text-center">
              <h2 className="font-semibold text-lg">{friend.fullName}</h2>
              <p className="text-sm text-gray-600 mt-1">
                🏠 Native:{" "}
                <span className="font-medium text-gray-800">
                  {friend.nativelanguage}
                </span>
              </p>
              <p className="text-sm text-gray-600">
                📘 Learning:{" "}
                <span className="font-medium text-gray-800">
                  {friend.learninglanguage}
                </span>
              </p>
            </div>

            {/* Chat Button */}
            <button className="mt-3 flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-xl shadow-md transition">
              <MessageSquare className="w-4 h-4" />
              Chat
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
