/*===== COMMON COMPONENTS =====*/
import DateInput from "./common/inputs/DateInput.svelte";
import TextInput from "./common/inputs/TextInput.svelte";
import EmailInput from "./common/inputs/EmailInput.svelte";
import TeleInput from "./common/inputs/TeleInput.svelte";
import PasswordInput from "./common/inputs/PasswordInput.svelte";
import Loader from "./common/loaders/Loader.svelte";
import Toast from "./common/toast-alerts/ToastContainer.svelte";

export const Common = {
    DateInput,
    TextInput,
    EmailInput,
    TeleInput,
    PasswordInput,
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
import AuthEmailConfirmation from "./auth/AuthEmailConfirmation.svelte";
import AuthLoginSignup from "./auth/AuthLoginSignup.svelte";
import LoginDivider from "./auth/LoginDivider.svelte";

export const Auth = {
    AuthEmailConfirmation,
    AuthLoginSignup,
    LoginDivider
}

/*===== IMAGES =====*/

export const Images = {}