import { supabase } from "$lib/supabase";
import type { AuthUser } from "@supabase/supabase-js";
import type { UserSettingsModel } from "$lib/models";

export const upsertUserSettings = async (authUserData: AuthUser | null) => {
    if (!authUserData) {
        throw new Error("No user data provided.");
    }

    // Assuming settings fields need to be populated or updated
    const { data, error } = await supabase.from("settings").upsert([
        {
            user_uuid: authUserData.id,
            // Include other settings fields here as needed
        },
    ]);

    if (error) {
        throw error;
    }

    if (data) {
        return data;
    }
};

export const getUserSettings = async (authUserData: AuthUser | null): Promise<UserSettingsModel | null> => {
    if (!authUserData) return null;

    const { data, error } = await supabase
        .from('settings')
        .select('*')
        .eq('user_uuid', authUserData.id)
        .single();

    if (error) {
        console.error("Supabase error:", error);
        if (error.code === 'PGRST116') {
            console.error(`No settings found for ${authUserData.id}, consider initializing settings.`);
        }
        return null;
    }

    return data;
};

export const updateSingleUserSettingsField = async (authUserData: AuthUser | null, formObject: { field: string; value: boolean | undefined }) => {
    if (!authUserData) {
        throw new Error("No user data provided.");
    }

    const { data, error } = await supabase
        .from('settings')
        .update({
            [formObject.field.toLowerCase()]: formObject.value,
        })
        .eq('user_uuid', authUserData.id);

    if (error) {
        console.error("Supabase error:", error);
        return null;
    }

    return data;
};


export const getSingleUserSettingField = async (
    authUserData: AuthUser | null,
    field: string
): Promise<boolean | undefined> => {
    if (!authUserData) {
        throw new Error("No user data provided.");
    }

    const { data, error } = await supabase
        .from('settings')
        .select(field)
        .eq('user_uuid', authUserData.id)
        .single();

    if (error) {
        console.error("Supabase error:", error);
        return undefined;
    }

    const settingsData = data as { [key: string]: any };
    const settingValue = settingsData ? settingsData[field] : undefined;

    return typeof settingValue === 'boolean' ? settingValue : undefined;
};
