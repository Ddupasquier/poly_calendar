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

// ============================================================
// Layout And Page Data Props
// ============================================================

interface AppLayoutDataProps {
	currentUser: User | null;
}

interface ConfirmSignupPageDataProps {}
