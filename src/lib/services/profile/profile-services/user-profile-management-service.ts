import { supabase } from "$lib/supabase";
import type { AuthUser } from "@supabase/supabase-js";

import { dateTimeUtils } from "$lib/utils";

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

export const getUserProfile = async (authUserData: AuthUser) => {
    if (!authUserData) {
        return null;
    }

    const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("user_uuid", authUserData.id)
        .single();

    if (error) {
        console.error("Supabase error while fetching user profile:", error);
        return null;
    }

    if (data && data.created_at) {
        data.created_at = dateTimeUtils.checkDate(data.created_at as string) as string;
    }

    return data;
};

export const updateSingleUserProfileField = async (authUserData: AuthUser | null, formObject: { field: string, value: string | boolean | number | Date }) => {
    if (!authUserData) {
        throw new Error("No user data provided.");
    }

    if (formObject.field === "birthday") {
        formObject.value = dateTimeUtils.checkDate(formObject.value as string) as string;
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
