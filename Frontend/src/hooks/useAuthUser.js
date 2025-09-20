// import { useQuery } from "@tanstack/react-query";
// import { getAuthUser } from "../lib/api.js";

// const useAuthUser = () => {
//     const authUser = useQuery({
//         queryKey: ["authUser"],
//         queryFn: getAuthUser,
//         retry: false, // auth check
// });

//  return {isLoading: authUser.isLoading,
//      authUser: authUser.data?.user}

// // return {
// //     isLoading: authUser.isLoading,
// //     User: authUser.data?.user, // 👈 yahan User nahi, authUser return karo
// //   };

// }

// export default useAuthUser

import { useQuery } from "@tanstack/react-query";
import { getAuthUser } from "../lib/api";

const useAuthUser = () => {
  const authUser = useQuery({
    queryKey: ["authUser"],
    queryFn: getAuthUser,
    retry: false, // auth check
  });
 console.log("AuthUser Data ===>", authUser.data);

  // return { isLoading: authUser.isLoading, authUser: authUser.data?.user };
 return { isLoading: authUser.isLoading, authUser: authUser.data?.user };
 
};
export default useAuthUser;