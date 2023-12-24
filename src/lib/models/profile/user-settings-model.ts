export interface UserSettingsModel {
    album_privacy_enabled: boolean | null
    calendar_privacy_enabled: boolean | null
    data_sharing_enabled: boolean | null
    email_notifications_enabled: boolean | null
    google_calendar_integration: boolean
    language_preference: string | null
    marketing_emails_enabled: boolean | null
    profile_visibility_public: boolean | null
    push_notifications_enabled: boolean | null
    theme_dark_mode_enabled: boolean | null
    timezone_offset: number | null
    two_factor_auth_enabled: boolean | null
    user_uuid: string
}