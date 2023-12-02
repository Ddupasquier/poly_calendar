import { supabase } from "$lib/supabase";
import type { AuthUser } from "@supabase/supabase-js";
import type { ProfileUser } from "$lib/models/profile/profile-user";

import { dateTimeUtils } from "$lib/utils/date-time-utils";
const { checkDate } = dateTimeUtils;


/*

export interface ProfileUser {
    user_uuid: string; // UUID
    email: string; // VARCHAR(255) UNIQUE NOT NULL
    phone?: string; // VARCHAR(20) NULL
    first_name?: string; // VARCHAR(100) NULL
    last_name?: string; // VARCHAR(100) NULL
    username?: string; // VARCHAR(100) UNIQUE NULL
    image_url?: string; // TEXT NULL
    time_zone?: string; // VARCHAR(50) NULL
    language?: string; // VARCHAR(50) DEFAULT 'en' NULL
    birthday?: string | Date; // DATE NULL
    about?: string; // TEXT NULL
    calendar_privacy_setting?: string; // VARCHAR(20) DEFAULT 'public' NULL
    album_privacy_setting?: string; // VARCHAR(20) DEFAULT 'public' NULL
    email_notifications?: boolean; // BOOLEAN DEFAULT true NULL
    push_notifications?: boolean; // BOOLEAN DEFAULT true NULL
    role?: string; // VARCHAR(50) DEFAULT 'user' NULL
    last_login_at?: string | Date; // TIMESTAMP WITH TIME ZONE NULL
    account_type?: string; // VARCHAR(50) DEFAULT 'individual' NULL
    subscription_type?: string; // VARCHAR(50) NULL
    subscription_start?: string | Date; // DATE NULL
    subscription_end?: string | Date; // DATE NULL
    facebook_url?: string; // TEXT NULL
    twitter_url?: string; // TEXT NULL
    instagram_url?: string; // TEXT NULL
    linkedin_url?: string; // TEXT NULL
    profile_visibility?: string; // VARCHAR(20) DEFAULT 'public' NULL
    created_at?: string | Date; // TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    updated_at?: string | Date; // TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    end_date?: string | Date; // TIMESTAMP WITH TIME ZONE NULL, Nullable end date for soft deletion
}

*/

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

const updateSingleUserProfileField = async (authUserData: AuthUser | null, formObject: { field: string; value: string | boolean | Date }) => {
    if (!authUserData) {
        throw new Error("No user data provided.");
    }

    if (formObject.field === "birthday") {
        console.log("formObject.value:", formObject.value);
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
