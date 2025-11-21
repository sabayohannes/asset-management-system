import { lazy } from 'react';

// project imports
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';

const DashboardDefault = Loadable(lazy(() => import('pages/dashboard/default')));


//const UserDashboard = Loadable(lazy(() => import('pages/user/UserDashboard')));

// other pages
const Color = Loadable(lazy(() => import('pages/component-overview/color')));
const Typography = Loadable(lazy(() => import('pages/component-overview/typography')));
const Shadow = Loadable(lazy(() => import('pages/component-overview/shadows')));
const SamplePage = Loadable(lazy(() => import('pages/extra-pages/sample-page')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
    path: '/',
    element: <DashboardLayout />,
    children: [
       
        {
            path: 'admindashboard',
            element: <DashboardDefault />
        },

        // USER DASHBOARD (optional)
        //{
           // path: 'userdashboard',
            //element: <UserDashboard />
       // },

        // other routes
        { path: 'typography', element: <Typography /> },
        { path: 'color', element: <Color /> },
        { path: 'shadow', element: <Shadow /> },
        { path: 'sample-page', element: <SamplePage /> }
    ]
};

export default MainRoutes;
