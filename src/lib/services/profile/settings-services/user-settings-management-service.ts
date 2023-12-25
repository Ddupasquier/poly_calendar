import { supabase } from "$lib/supabase";
import type { AuthUser, User } from "@supabase/supabase-js";
import type { UserSettingsModel } from "$lib/models";
import { fetchCurrentUser } from "$lib/services";

const upsertUserSettings = async (authUserData: AuthUser | null) => {
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

const getUserSettings = async (): Promise<UserSettingsModel | undefined> => {
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

interface UpdateResponse<T> {
    data: T | null;
    error: Error | null;
}

const updateSingleUserSettingsField = async (
    formObject: {
        field: keyof UserSettingsModel;
        value: boolean;
    }
): Promise<UpdateResponse<Partial<UserSettingsModel>[]>> => {
    const user = await fetchCurrentUser();
    if (!user) {
        throw new Error('Authentication data not found.');
    }

    const updatePayload = {
        [formObject.field]: formObject.value,
    };

    try {
        const updateResponse = await supabase
            .from('settings')
            .update(updatePayload)
            .eq('user_uuid', user.id)
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

const getSingleUserSettingField = async (
    field: keyof UserSettingsModel
): Promise<string | number | boolean | null> => {
    const user = await fetchCurrentUser();
    if (!user) {
        throw new Error('Authentication data not found.');
    }

    const { data, error } = await supabase
        .from('settings')
        .select(field)
        .eq('user_uuid', user.id)
        .single();

    if (error) {
        throw error;
    }

    const settingsData = data as UserSettingsModel;
    return settingsData[field];
};

export {
    getUserSettings,
    upsertUserSettings,
    updateSingleUserSettingsField,
    getSingleUserSettingField
}