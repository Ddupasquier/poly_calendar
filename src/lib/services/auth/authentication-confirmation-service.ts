// import { supabase } from "$lib/supabase";
// import { saveAuthUserAndSession, setHelperText } from "$lib/stores";
// import { upsertUserProfile } from "$lib/services";
// import type { Session, User } from "@supabase/supabase-js";

// interface VerificationData {
//     user: User | null;
//     session: Session | null;
// }

// const verifySignUpToken = async (token: string): Promise<VerificationData> => {
//     if (!token) {
//         console.error("verifySignUpToken: No access token provided.");
//         throw new Error("No access token provided.");
//     }

//     try {
//         const { data, error } = await supabase.auth.verifyOtp({
//             token_hash: token,
//             type: "email",
//         });

//         if (error) {
//             console.error("verifySignUpToken: Error returned from Supabase:", error);
//             throw error;
//         }

//         if (!data) {
//             console.error("verifySignUpToken: No data returned from Supabase.");
//             throw new Error("No data returned from Supabase.");
//         }

//         return {
//             user: data.user ?? null,
//             session: data.session ?? null,
//         };
//     } catch (err) {
//         console.error("verifySignUpToken: Exception thrown:", err);
//         throw err;
//     }
// };

// const processSignUpConfirmation = (data: VerificationData) => {
//     if (!data.user) {
//         throw new Error("No user returned from Supabase.");
//     } else {
//         if (data.user && data.session) {
//             saveAuthUserAndSession(data.user, data.session);
//         }
//     }
// };

// const checkUserStatus = async (email: string | undefined): Promise<{ isVerified: boolean; user: { email_confirmed_at: string | null } | null }> => {
//     try {
//         const { data: user, error } = await supabase
//             .from('public.users')
//             .select('email_confirmed_at')
//             .eq('email', email)
//             .single();

//         if (error) {
//             console.error("checkUserStatus: Error returned from Supabase:", error);
//             throw error;
//         }

//         return {
//             isVerified: !!user?.email_confirmed_at,
//             user,
//         };
//     } catch (error) {
//         console.error("checkUserStatus: Exception thrown:", error);
//         throw error;
//     }
// };

// export const confirmSignUp = async (token: string): Promise<{ success: boolean; message: string }> => {
//     let verificationData: VerificationData | undefined;

//     try {
//         verificationData = await verifySignUpToken(token);

//         if (!verificationData || !verificationData.user || !verificationData.session) {
//             console.error("confirmSignUp: Verification succeeded but no user or session data returned.");
//             setHelperText(true, "Verification succeeded but no user or session data returned.");
//             throw new Error("Verification succeeded but no user or session data returned.");
//         }

//         processSignUpConfirmation(verificationData);

//         await upsertUserProfile(verificationData.user);
//         setHelperText(false, "Sign up confirmed.");
//         return { success: true, message: "Sign up confirmed." };
//     } catch (err) {
//         console.error("confirmSignUp: Error during sign up confirmation:", err);

//         if (verificationData?.user) {
//             const userStatus = await checkUserStatus(verificationData.user.email);
//             if (userStatus.isVerified) {
//                 setHelperText(false, "Sign up confirmed, but an error occurred. Please try logging in.");
//                 return { success: true, message: "Sign up confirmed, but an error occurred. Please try logging in." };
//             }
//         }

//         setHelperText(true, (err as Error).message || "Error verifying the signup token. Please try again.");
//         return { success: false, message: (err as Error).message || "Error verifying the signup token. Please try again." };
//     }
// };
