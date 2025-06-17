import { createBrowserRouter } from "react-router";
import { HomePage, NotFound, SettingsPage, SignInForm, SignUpForm } from "./pages";
import ProfilePage from "./pages/technician/TechnicianProfilePage";
import TechnicianSetup from "./pages/auth/TechnicianSetup";
import TechnicianDashBoard from "./pages/technician/DashBoard";
import MyJobs from "./pages/technician/MyJobs";
import TechnicianMessages from "./pages/technician/Messages";
import Earnings from "./pages/technician/Earnings";
import TechnicianSettingsPage from "./pages/technician/SettingsPage";
import JobDetails from "./pages/technician/JobDetails";
import ClientDashboard from "./pages/client/DashBoard";
import TechProfile from "./pages/client/TechProfile";
import Technicians from "./pages/client/Technicians";
import ClientMessages from './pages/client/Messages'
import ClientSettings from './pages/client/SettingsPage'
import Dashboard from "./pages/DashBoard";

const routeLinks = {
    signUp: '/signup',
    signIn: '/signIn',
    setup: '/setup',
    techHome: '/technician',
    dashboard: '/dashboard',
}

const router = createBrowserRouter([
    {
        path: '/',
        Component: HomePage,
    },
    {
        path: '/dashboard',
        element: <Dashboard />
    },
    {
        path: 'signin',
        Component: SignInForm,
    },
    {
        path: 'signup',
        Component: SignUpForm,
    },
    {
        path: 'signup/:role',
        Component: SignUpForm,
    },
    {
        path: 'setup',
        Component: TechnicianSetup,
    },
    {
        path: '/technician',
        children: [
            {
                path: 'myJobs',
                Component: MyJobs,
            },
            {
                path: 'job-details',
                Component: JobDetails,
            },
            {
                path: 'messages',
                Component: TechnicianMessages,
            },
            {
                path: 'earnings',
                Component: Earnings,
            },
            {
                path: 'settings',
                Component: TechnicianSettingsPage,
            }
        ]
    },
    {
        path: '/client',
        children: [
            {
                path: 'technicians',
                Component: Technicians,
            },
            {
                path: 'technician-profile',
                Component: TechProfile,
            },
            {
                path: 'requests',

            },
            {
                path: 'messages',
                Component: ClientMessages,
            },
            {
                path: 'settings',
                Component: ClientSettings,
            }
        ]
    },
    {
        path: '*',
        Component: NotFound,
    }

])

export default router;

export { routeLinks }