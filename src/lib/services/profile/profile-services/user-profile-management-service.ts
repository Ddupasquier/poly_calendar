import { supabase } from "$lib/supabase";
import type { AuthUser } from "@supabase/supabase-js";

import { checkDate } from "$lib/utils";
import type { UserProfileModel } from "$lib/models";

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

export const getUserProfile = async (): Promise<UserProfileModel | null> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user)
        console.log('[getUserProfile] Preparing to query Supabase for user_uuid:', user.id);
    console.log('[getUserProfile] Preparing to query Supabase for user_uuid:', user);

    if (!user) {
        throw new Error("No user data provided.");
    }

    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('user_uuid', user.id)
        .single();

    if (error) {
        console.error("Supabase error while fetching user profile:", error);
        throw error;
    }

    if (!data) {
        console.log("[getUserProfile] Query successful but no data returned from Supabase.");
        return null;
    }

    if ('created_at' in data) {
        data.created_at = checkDate(data.created_at as string);
    }

    return data;
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
