/*===== COMMON COMPONENTS =====*/
import RadioGroupDefault from "./common/radio-groups/RadioGroupDefault.svelte";
import DateInput from "./common/inputs/DateInput.svelte";
import TextInput from "./common/inputs/TextInput.svelte";
import EmailInput from "./common/inputs/EmailInput.svelte";
import TeleInput from "./common/inputs/TeleInput.svelte";
import PasswordInput from "./common/inputs/PasswordInput.svelte";
import HideShowPassword from "./common/inputs/HideShowPassword.svelte";
import Loader from "./common/loaders/Loader.svelte";
import Toast from "./common/toast-alerts/ToastContainer.svelte";

export const Common = {
    RadioGroupDefault,
    DateInput,
    TextInput,
    EmailInput,
    TeleInput,
    PasswordInput,
    HideShowPassword,
    Loader,
    Toast
}

/*===== LAYOUT COMPONENTS =====*/
import Nav from "./layout/navigation/Nav.svelte";
import NavTab from "./layout/navigation/NavTab.svelte";
import Logo from "./layout/navigation/logo/Logo.svelte";

export const Layout = {
    Nav,
    NavTab,
    Logo
}

/*===== AUTH COMPONENTS =====*/
import AuthLoginSignup from "./auth/AuthLoginSignup.svelte";
import LoginDivider from "./auth/LoginDivider.svelte";

export const Auth = {
    AuthLoginSignup,
    LoginDivider
}

/*===== IMAGES =====*/

export const Images = {}

/*===== SVG ICONS =====*/
import Google from "./svg/Google.svelte";
import Settings from "./svg/Settings.svelte";

export const SVG = {
    Google,
    Settings
}