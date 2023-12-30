// ============================================================
// Base Definitions
// ============================================================

interface BaseLayoutData {
	status: number;
	error: boolean;
	message?: string;
	redirect?: string;
}

// ============================================================
// Layout And Page Data
// ============================================================

interface AppLayoutData extends BaseLayoutData {
	props: AppLayoutDataProps;
}

interface ConfirmSignupPageData extends BaseLayoutData {
	props: ConfirmSignupPageDataProps;
}

interface CalendarPageData extends BaseLayoutData {
	props: CalendarPageDataProps;
}

// ============================================================
// Layout And Page Data Props
// ============================================================

interface AppLayoutDataProps {
	currentUser: User | null;
}

interface ConfirmSignupPageDataProps { }

interface CalendarPageDataProps { 
	session?: Session | null;
	calendars?: GoogleCalendarListEntry[] | null;
	events?: GoogleCalendarEvent[] | null;
}