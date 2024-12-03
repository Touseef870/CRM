// import { useState, useEffect, useCallback } from "react";

// function useProfile() {
//   const [profile, setProfileState] = useState<any>(null);
//   const [errors, setError] = useState<any>(null);

//   const isExpired = (timestamp: number) => {
//     const now = Date.now();
//     const twentyFourHours = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
//     return now - timestamp > twentyFourHours;
//   };

//   useEffect(() => {
//     try {
//       const savedProfile = localStorage.getItem("profile");
//       const savedTimestamp = localStorage.getItem("profileTimestamp");

//      if (savedProfile && savedTimestamp) {
//         const timestamp = parseInt(savedTimestamp, 10);
//         if (isExpired(timestamp)) {
//             localStorage.removeItem("profile");
//             localStorage.removeItem("profileTimestamp");
//             throw new Error("Profile has expired. Please log in again.");
//           }

//         setProfileState(JSON.parse(savedProfile));
//       } else {
//         throw new Error("Profile not found in localStorage.");
//       }
//     } catch (err : any) {
//       setError(err.message);
//     }
//   }, []);

  
//   const setProfile = useCallback(
//     (newProfile : any) => {
//       try {
//         if (!newProfile || typeof newProfile !== "object") {
//           throw new Error("Invalid profile format. It must be an object.");
//         }
//         const timestamp = Date.now();
//         localStorage.setItem("profile", JSON.stringify(newProfile));
//         localStorage.setItem("profileTimestamp", timestamp.toString());

//         setProfileState(newProfile);
//         setError(null);
//       } catch (err : any) {
//         setError(err.message);
//       }
//     },
//     []
//   );

//   return { profile, errors, setProfile };
// }

// export default useProfile;