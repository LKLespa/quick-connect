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
import TechProfile from "./pages/client/ClientProfile";
import Technicians from "./pages/client/Technicians";
import AllChats from './pages/shared/AllChats'
import ClientSettings from './pages/client/SettingsPage'
import Dashboard from "./pages/DashBoard";
import ClientHeader from "./pages/client/Header";
import ClientRequest from "./pages/client/JobRequest";
import ChatRoom from "./pages/shared/ChatRoom";
import ClientProfile from "./pages/client/ClientProfile";
import TechnicianProfile from "./pages/client/TechnicianProfile";

const routeLinks = {
    signUp: '/signup',
    signIn: '/signIn',
    setup: '/setup',
    techHome: '/technician',
    clientHome: '/client',
    clientRequest: '/client/requests',
    clientHistory: '/client/history',
    technicians: '/client/technicians',
    clientProfile: '/client/profile',
    clientChats: '/client/chats',
    clientSettings: '/client/settings',
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
                path: '',
                Component: TechnicianDashBoard,
            },
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
        Component: ClientHeader,
        children: [
            {
                path: '',
                Component: ClientDashboard,
            },
            {
                path: 'technicians',
                Component: Technicians,
            },
            {
                path: 'technicians/:technicianId',
                Component: TechnicianProfile,
            },
            {
                path: 'requests',
                Component: ClientRequest,
            },
            {
                path: 'chats',
                Component: AllChats,
            },
            {
                path: 'chats/:technicianId',
                Component: ChatRoom,
            },
            {
                path: 'settings',
                Component: ClientSettings,
            },
            {
                path: 'profile',
                Component: ClientProfile,
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