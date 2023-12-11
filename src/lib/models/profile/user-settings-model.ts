export interface UserSettingsModel {
    user_uuid: string; // UUID PRIMARY KEY REFERENCES public.users(user_uuid)
    calendar_privacy_enabled?: boolean; // BOOLEAN DEFAULT true
    album_privacy_enabled?: boolean; // BOOLEAN DEFAULT true
    email_notifications_enabled?: boolean; // BOOLEAN DEFAULT true
    push_notifications_enabled?: boolean; // BOOLEAN DEFAULT true
    profile_visibility_public?: boolean; // BOOLEAN DEFAULT true
    theme_dark_mode_enabled?: boolean; // BOOLEAN DEFAULT false
    timezone_offset?: number; // INT DEFAULT 0
    language_preference?: string; // VARCHAR(50) DEFAULT 'en'
    marketing_emails_enabled?: boolean; // BOOLEAN DEFAULT false
    two_factor_auth_enabled?: boolean; // BOOLEAN DEFAULT false
    data_sharing_enabled?: boolean; // BOOLEAN DEFAULT false
    google_calendar_integration: boolean; // BOOLEAN DEFAULT false
}