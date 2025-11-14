import { lazy } from 'react';

// project imports
import Loadable from 'uiComponent/Loadable';
import MinimalLayout from '../layout/MinimalLayout';

// maintenance routing
const LoginPage = Loadable(lazy(() => import('../views/pages/authentication/Login')));
const RegisterPage = Loadable(lazy(() => import('../views/pages/authentication/Register')));

// ==============================|| AUTHENTICATION ROUTING ||============================== //

const AuthenticationRoutes = {
  path: '/',
  element: <MinimalLayout />,
  children: [
    {
      path: '/pages/login',
      element: <LoginPage />
    },
    {
      path: '/pages/register',
      element: <RegisterPage />
    }
  ]
};

export default AuthenticationRoutes;
