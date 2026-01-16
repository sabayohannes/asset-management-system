import { lazy } from 'react';

// project imports
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';
import AssetDetail from 'pages/component-overview/AssetDetail';
import EditProfile from 'layout/Dashboard/Header/HeaderContent/Profile/EditProfile.jsx'
import ViewProfile from 'layout/Dashboard/Header/HeaderContent/Profile/viewProfile.jsx'
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard/default')));
import CreateAsset from 'pages/component-overview/CreateAsset';
import AssetRequests from 'pages/component-overview/AssetRequests'
import AssetReport from 'pages/component-overview/AssetReport'
import AssetEdit from 'pages/component-overview/AssetEdit'

//const UserDashboard = Loadable(lazy(() => import('pages/user/UserDashboard')));

// other pages
const Color = Loadable(lazy(() => import('pages/component-overview/color')));
const AssetReview = Loadable(lazy(() => import('pages/component-overview/AssetReview')));
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
        { path: 'AssetReview', element: <AssetReview /> },
        { path: 'color', element: <Color /> },
        { path: 'shadow', element: <Shadow /> },
        { path: 'sample-page', element: <SamplePage /> },
        { path: 'assets/requests', element: <AssetRequests /> },
        { path: 'assets/edit/:assetId', element: <AssetEdit /> },
       { path: 'assets/:assetId', element: <AssetDetail/> },//

        { path: "/edit-profile", element: <EditProfile />},
        { path: "/view-profile", element: <ViewProfile /> },
        { path: '/assets/new', element: <CreateAsset /> },
        { path: '/assets/reports', element: <AssetReport /> },
       
       
    ]
};

export default MainRoutes;
