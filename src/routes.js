import { createBrowserRouter } from "react-router";
import { HomePage, NotFound, SettingsPage, SignInForm, SignUpForm } from "./pages";
import ProfilePage from "./pages/dashboard/ProfilePage";
import TechnicianSetup from "./pages/auth/TechnicianSetup";

const routeLinks = {
    signUp: '/signup',
    signIn: '/auth/signIn',
    setup: '/auth/setup',
}

const router = createBrowserRouter([
    {
        path: '/',
        Component: HomePage,
    },
    {
        path: '/profile',
        Component: ProfilePage,
    },
    {
        path: '/settings',
        Component: SettingsPage,
    },
    {
        path: '/auth',
        children: [
            {
                path: 'signin',
                Component: SignInForm,
            },
            {
                path: 'signup',
                Component: SignUpForm,
            },
            {
                path: 'setup',
                Component: TechnicianSetup,
            }
        ]
    },
    {
        path: routeLinks.setup,
        Component: TechnicianSetup,
    },
    {
        path: '*',
        Component: NotFound,
    }

])

export default router;

export { routeLinks }