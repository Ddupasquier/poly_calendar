import { supabase } from "../supabase";
import type { AuthUser } from "@supabase/supabase-js";
import type { ProfileUser } from "$lib/models/profile/profile-user";

const upsertUserProfile = async (authUserData: AuthUser | null) => {
    if (!authUserData) {
        throw new Error("No user data provided.");
    }

    const { data, error } = await supabase.from("users").upsert([
        {
            user_uuid: authUserData.id,
            email: authUserData.email,
            phone: authUserData.phone,
            updated_at: authUserData.updated_at || new Date().toISOString(),
            last_login_at: authUserData.last_sign_in_at,
        },
    ]);

    if (error) {
        throw error;
    }

    if (data) {
        return data;
    }
}

const getUserProfile = async (authUserData: AuthUser | null): Promise<ProfileUser | null> => {
    if (!authUserData) return null;

    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('user_uuid', authUserData.id)
        .single();

    if (error) {
        console.error("Supabase error:", error);
        return null;
    }

    return data;
};

export const userProfileManagementService = {
    upsertUserProfile,
    getUserProfile,
};
