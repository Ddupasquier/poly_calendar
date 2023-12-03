import { supabase } from "$lib/supabase";
import type { AuthUser } from "@supabase/supabase-js";
import type { UserProfileModel } from "$lib/models/profile/user-profile-model";

import { dateTimeUtils } from "$lib/utils/date-time-utils";
const { checkDate } = dateTimeUtils;

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

const getUserProfile = async (authUserData: AuthUser) => {
    if (!authUserData) return null;

    const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("user_uuid", authUserData.id)
        .single();

    if (error) {
        console.error("Supabase error:", error);
        return null;
    }

    if (data && data.created_at) {
        data.created_at = checkDate(data.created_at as string) as string;
    }

    return data;
};

const updateSingleUserProfileField = async (authUserData: AuthUser | null, formObject: { field: string; value: string | boolean | Date }) => {
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

export const userProfileManagementService = {
    upsertUserProfile,
    getUserProfile,
    updateSingleUserProfileField,
};
