import { createBrowserRouter } from "react-router";
import { HomePage, NotFound, SettingsPage, SignInForm, SignUpForm } from "./pages";
import TechnicianSetup from "./pages/auth/TechnicianSetup";
import TechnicianDashBoard from "./pages/technician/DashBoard";
import MyJobs from "./pages/technician/MyJobs";
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
import TechnicianHeader from "./pages/technician/Header";
import ClientRequests from "./pages/client/JobRequest";
import ClientsPage from "./pages/technician/Clients";
import ClientProfileForTechnician from "./pages/technician/ClientProfile";
import TechnicianProfilePage from "./pages/technician/ProfilePage";

const routeLinks = {
    signUp: '/signup',
    signIn: '/signIn',
    setup: '/setup',
    clientHome: '/client',
    clientRequest: '/client/requests',
    clientHistory: '/client/history',
    technicians: '/client/technicians',
    clientProfile: '/client/profile',
    clientChats: '/client/chats',
    clientSettings: '/client/settings',
    techHome: '/technician',
    techRequest: '/technician/request',
    techHistory: '/technician',
    clients: '/technician/clients',
    techChats: '/technician/chats',
    techProfile: '/technician/profile',
    techJobs: '/technician/my-jobs',
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
        Component: TechnicianHeader,
        children: [
            {
                path: '',
                Component: TechnicianDashBoard,
            },
            {
                path: 'request',
                Component: ClientRequests,
            },
            {
                path: 'my-jobs',
                Component: MyJobs,
            },
            {
                path: 'chats',
                Component: AllChats,
            },
            {
                path: 'chats/:clientId',
                Component: ChatRoom,
            },
            {
                path: 'profile',
                Component: TechnicianProfilePage,
            },
            {
                path: 'clients',
                Component: ClientsPage,
            },
            {
                path: 'clients/:clientId',
                Component: ClientProfileForTechnician,
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