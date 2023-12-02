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
    birthday?: string | Date; // ISO 8601 date string or Date object
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