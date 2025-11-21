import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import Loadable from 'components/Loadable';

const LoginPage = Loadable(lazy(() => import('pages/auth/Login')));
const RegisterPage = Loadable(lazy(() => import('pages/auth/Register')));

const LoginRoutes = {
  path: '/',
  children: [
    {
      path: '/',
      children: [
        { index: true, element: <Navigate to="login" replace /> },
        { path: 'login', element: <LoginPage /> },
        { path: 'register', element: <LoginPage /> }  // <--- you requested this
      ]
    }
  ]
};

export default LoginRoutes;
