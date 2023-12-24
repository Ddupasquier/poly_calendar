import { supabase } from "$lib/supabase";
import type { AuthUser, User } from "@supabase/supabase-js";
import type { UserSettingsModel } from "$lib/models";
import { browser } from "$app/environment";

export const upsertUserSettings = async (authUserData: AuthUser | null) => {
    if (!authUserData) {
        throw new Error("No user data provided.");
    }

    const { data, error } = await supabase.from("settings").upsert([
        {
            user_uuid: authUserData.id,
            // Include other settings fields here as needed
        },
    ]);

    if (error) {
        throw error;
    }

    return data;
};

export const getUserSettings = async (): Promise<UserSettingsModel | undefined> => {
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
        const { data: userSettings, error: settingsError } = await supabase
            .from('settings')
            .select('*')
            .eq('user_uuid', user.id)
            .single();

        if (settingsError) throw new Error(settingsError.message);

        return userSettings;
    }
};

export interface UpdateResponse<T> {
    data: T | null;
    error: Error | null;
}

export const updateSingleUserSettingsField = async (
    formObject: {
        field: keyof UserSettingsModel;
        value: boolean;
    }
): Promise<UpdateResponse<Partial<UserSettingsModel>[]>> => {
    const authUserDataString = localStorage.getItem('authUser');
    if (!authUserDataString) {
        throw new Error('Authentication data not found.');
    }

    const authUserData: User = JSON.parse(authUserDataString);

    if (!authUserData.id) {
        return { data: null, error: new Error('User ID is missing') };
    }

    const updatePayload = {
        [formObject.field]: formObject.value,
    };

    try {
        const updateResponse = await supabase
            .from('settings')
            .update(updatePayload)
            .eq('user_uuid', authUserData.id)
            .select(formObject.field);

        if (updateResponse.error) {
            throw updateResponse.error;
        }

        if (!updateResponse.data) {
            return { data: null, error: new Error('No rows updated') };
        }

        return { data: updateResponse.data, error: null };
    } catch (error) {
        console.error("Error while updating settings from updateSingleUserSettingsField:", error);
        return { data: null, error: error instanceof Error ? error : new Error(String(error)) };
    }
};

export const getSingleUserSettingField = async (
    field: keyof UserSettingsModel
): Promise<string | number | boolean | null> => {
    const authUserDataString = localStorage.getItem('authUser');
    if (!authUserDataString) {
        throw new Error('Authentication data not found.');
    }

    const authUserData: User = JSON.parse(authUserDataString);

    if (!authUserData) {
        throw new Error("No user data provided.");
    }

    const { data, error } = await supabase
        .from('settings')
        .select(field)
        .eq('user_uuid', authUserData.id)
        .single();

    if (error) {
        throw error;
    }

    const settingsData = data as UserSettingsModel;
    return settingsData[field];
};
