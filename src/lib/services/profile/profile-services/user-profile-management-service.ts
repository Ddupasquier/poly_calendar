import type { UserProfileModel } from "$lib/models";
import { supabase } from "$lib/supabase";
import { handleError } from "$lib/utils";
import type { AuthUser, PostgrestError } from "@supabase/supabase-js";
import { checkDate } from "$lib/utils";

const upsertUserProfile = async (authUserData: AuthUser): Promise<UserProfileModel | null> => {
    if (!authUserData) {
        handleError({
            error: new Error("No user data provided."),
            helperText: "No user data provided.",
        });
    }

    const { data: upsertedUserProfile, error } = await supabase.from("users").upsert([
        {
            user_uuid: authUserData.id,
            email: authUserData.email,
            phone: authUserData.phone,
            updated_at: authUserData.updated_at || new Date().toISOString(),
            last_login_at: authUserData.last_sign_in_at,
        },
    ])
        .select("*")
        .single();

    if (upsertedUserProfile) {
        return upsertedUserProfile;
    } else {
        handleError({
            error,
            helperText: "Error upserting user profile.",
        });
        return null;
    }
}

const getUserProfile = async (): Promise<UserProfileModel | undefined> => {
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

export const updateSingleUserProfileField = async (authUserData: AuthUser | null, formObject: { field: string, value: string | boolean | number | Date }): Promise<UserProfileModel | PostgrestError | null> => {
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
        return error;
    }

    return data;
};

export {
    upsertUserProfile,
    getUserProfile,
}




/*

const validationMessages = [
    {
        error: "duplicate key value violates unique constraint 'user_username_key'",
        validationMessage: "Username already exists. Please choose another username."
    },
    {
        error: "violates check constraint 'users_username_check'",
        validationMessage: "Username cannot contain special characters besides [$, !, _, -]."
    },
    {
        error: "duplicate key value violates unique constraint 'user_email_key'",
        validationMessage: "Email already exists. Please choose another email."
    },
    {
        error: "duplicate key value violates unique constraint 'user_phone_key'",
        validationMessage: "Phone number already exists. Please choose another phone number."
    },
];

interface CustomError {
    message: string;
}

export const updateSingleUserProfileField = async (
    authUserData: AuthUser | null,
    formObject: {
        field: string, value: string | boolean | number | Date
    }
): Promise<{
    data: UserProfileModel | null,
    error: CustomError | null
}> => {
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
        const userFriendlyError = validationMessages.find(vm => error.message.includes(vm.error));
        const messageToShow = userFriendlyError ? userFriendlyError.validationMessage : error.message;

        addToast(messageToShow, { duration: 5000, closable: true, openTilClosed: true });
        // Use the error object structure you've defined
        return { data: null, error: { message: messageToShow } };
    }

    return { data, error: null };
};

*/