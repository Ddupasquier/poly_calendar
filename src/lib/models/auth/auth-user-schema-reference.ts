interface AuthUserSchemaReference {
    instance_id: string | null; // uuid
    id: string | null; // uuid
    aud: string | null; // character varying(255)
    role: string | null; // character varying(255)
    email: string | null; // character varying(255)
    encrypted_password: string | null; // character varying(255)
    email_confirmed: Date | null; // timestamp with time zone
    invited_at: Date | null; // timestamp with time zone
    confirmation_token: string | null; // character varying(255)
    confirmation_sent_at: Date | null; // timestamp with time zone
    recovery_token: string | null; // character varying(255)
    recovery_sent_at: Date | null; // timestamp with time zone
    email_change_token: string | null; // character varying(255)
    email_change: string | null; // character varying(255)
    email_change_sent_at: Date | null; // timestamp with time zone
    last_sign_in_at: Date | null; // timestamp with time zone
    raw_app_meta_data: any | null; // jsonb
    raw_user_meta_data: any | null; // jsonb
    is_super_admin: boolean | null; // boolean
    created_at: Date | null; // timestamp with time zone
    updated_at: Date | null; // timestamp with time zone
    phone: string | null; // text
    phone_confirmed_at: Date | null; // timestamp with time zone
    phone_change: string | null; // text
    phone_change_token: string | null; // character varying(255)
    phone_change_sent_at: Date | null; // timestamp with time zone
    confirmed_at: Date | null; // timestamp with time zone
    email_change_count: number | null; // smallint
    banned_until: Date | null; // timestamp with time zone
    reauthentication_token: string | null; // character varying(255)
    reauthentication_sent_at: Date | null; // timestamp with time zone
    is_sso_user: boolean | null; // boolean
    deleted_at: Date | null; // timestamp with time zone
}
