import { supabase } from "$lib/supabase";
import type { AuthUser, User } from "@supabase/supabase-js";

import { checkDate } from "$lib/utils";
import type { UserProfileModel } from "$lib/models";
import { fetchCurrentUser } from "$lib/services";

export const upsertUserProfile = async (authUserData: AuthUser | null) => {
    if (!authUserData) {
        console.error("No user data provided for upsert.");
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
        console.error("Error upserting user profile:", error);
        throw error;
    }

    return data;
}

export const getUserProfile = async (): Promise<UserProfileModel | undefined> => {
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
        const { data: userProfile, error: profileError } = await supabase
            .from('users')
            .select('*')
            .eq('user_uuid', user.id)
            .single();

        if (profileError) throw new Error(profileError.message);

        return userProfile
    }
};

export const updateSingleUserProfileField = async (authUserData: AuthUser | null, formObject: { field: string, value: string | boolean | number | Date }) => {
    if (!authUserData) {
        throw new Error("No user data provided.");
    }

    if (formObject.field === "birthday") {
        formObject.value = checkDate(formObject.value as string) as string;
    }

    const { data, error } = await supabase
        .from('users')
        .update({
            [formObject.field.toLowerCase()]: formObject.value,
            updated_at: new Date().toISOString(),
        })
        .eq('user_uuid', authUserData.id);

    if (error) {
        console.error("Supabase error:", error);
        return null;
    }

    return data;
};