<script>
    import { FontAwesomeIcon } from "@fortawesome/svelte-fontawesome";
    import {
        faCalendar,
        faLock,
        faMailBulk,
        faPowerOff,
    } from "@fortawesome/free-solid-svg-icons";

    import { authUser } from "$lib/stores/userStore";
    import { shortDate } from "$lib/utils/utils";
    import { colors } from "$lib/palette";
</script>

<div class="profile-container">
    <div class="profile-section">
        <div class="profile-header">Account Information</div>
        <div class="profile-info">
            <FontAwesomeIcon
                icon={faMailBulk}
                class="icon"
                style={`color: ${colors["--color-theme-2-D1"]}`}
            />
            <strong>Email:</strong>
            {$authUser?.email}
            <span>
                {$authUser?.email_confirmed_at
                    ? " (Confirmed)"
                    : " (Unconfirmed)"}
            </span>
        </div>
    </div>

    <div class="profile-section">
        <div class="profile-header">Membership Details</div>
        <div class="profile-info">
            <FontAwesomeIcon
                icon={faCalendar}
                style={`color: ${colors["--color-theme-2-D1"]}`}
            />
            <strong>Member Since:</strong>
            {shortDate($authUser?.created_at)}
        </div>
        <div class="profile-info">
            <FontAwesomeIcon
                icon={faPowerOff}
                style={`color: ${colors["--color-theme-2-D1"]}`}
            />
            <strong>Last Login:</strong>
            {shortDate($authUser?.last_sign_in_at)}
        </div>
    </div>

    <div class="profile-section">
        <div class="profile-header">Security</div>
        <div class="profile-info">
            <FontAwesomeIcon
                icon={faLock}
                style={`color: ${colors["--color-theme-2-D1"]}`}
            />
            <strong>Account Status:</strong>
            {$authUser?.confirmed_at ? "Secure" : "Action Required"}
        </div>
    </div>
</div>

<style lang="scss">
    .profile-container {
        position: relative;
        background: var(--color-bg-2);
        padding: 20px;
        border-radius: var(--primary-border-radius);
    }

    .profile-container::after {
        content: "";
        position: absolute;
        top: -1px;
        left: -1px;
        right: -1px;
        bottom: -1px;
        z-index: -1;
        background: linear-gradient(
            to bottom,
            var(--color-theme-1),
            rgba(0, 123, 255, 0)
        );
        border-radius: inherit;
        pointer-events: none;
    }

    .profile-section {
        margin-bottom: 20px;
        padding-bottom: 10px;
        border-bottom: 1px solid #eee;

        &:last-child {
            border-bottom: none;
            margin-bottom: 0;
        }
    }

    .profile-header {
        font-size: 24px;
        color: var(--color-text-dark);
        margin-bottom: 10px;
    }

    .profile-info {
        font-size: 16px;
        color: var(--color-text-light);
        line-height: 1.5;
    }

    .profile-info strong {
        color: var(--color-text-light);
    }
</style>
