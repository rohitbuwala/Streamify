// src/pages/FriendsPage.jsx
import { useQuery } from "@tanstack/react-query";
import { getUserFriends } from "../lib/api.js";
import { Loader2, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import { getLanguageFlag } from "../components/getLanguageFlag";
import { capitialize } from "../lib/utils";

export default function FriendsPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
    select: (data) => (Array.isArray(data) ? data : []),
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

      <div className="divide-y divide-gray-200">
        {data.map((friend) => (
          <div
            key={friend._id}
            className="flex items-center justify-between py-4 hover:bg-gray-50 transition"
          >
            {/* Left: Profile + Info */}
            <div className="flex items-center gap-4">
              <img
                src={friend.profilePic || "/avatar.png"}
                alt={friend.fullName}
                className="w-14 h-14 rounded-full object-cover border"
              />
              <div>
                <h2 className="font-semibold">{friend.fullName}</h2>

                {/* Native + Learning Languages */}
                <div className="flex gap-3 text-sm text-gray-600 flex-wrap">
                  {friend.nativeLanguage && (
                    <span className="flex items-center gap-1">
                      {getLanguageFlag(friend.nativeLanguage)}
                      Native: {capitialize(friend.nativeLanguage)}
                    </span>
                  )}
                  {friend.learningLanguage && (
                    <span className="flex items-center gap-1">
                      {getLanguageFlag(friend.learningLanguage)}
                      Learning: {capitialize(friend.learningLanguage)}
                    </span>
                  )}
                </div>

                {/* Bio */}
                {friend.bio && (
                  <p className="text-xs text-gray-500 mt-1">{friend.bio}</p>
                )}
              </div>
            </div>

            {/* Right: Chat Button */}
            <Link
              to={`/chat/${friend._id}`}
              className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium px-3 py-1.5 rounded-lg shadow-sm transition"
            >
              <MessageSquare className="w-4 h-4" />
              Chat
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
