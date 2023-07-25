import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import SimpleLayout from './layouts/simple';
//
import BlogPage from './pages/BlogPage';
import UserPage from './pages/UserPage';
import LoginPage from './pages/LoginPage';
import Page404 from './pages/Page404';
import ProductsPage from './pages/ProductsPage';
import DashboardAppPage from './pages/DashboardAppPage';
import GradProfilePage from './pages/GradProfile';
import BrowsePage from './pages/Browse';
import ConnectionPage from './pages/ConnectionPage';
import HomePage from './pages/HomePage';
import HomePageNew from './pages/HomePageNew';

// ----------------------------------------------------------------------

export default function Router() {
  const routes = useRoutes([
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        { path: 'app', element: <BrowsePage /> },
        { path: 'user', element: <UserPage /> },
        { path: 'products', element: <ProductsPage /> },
        { path: 'browse', element: <BrowsePage /> },
        { path: 'blog', element: <BlogPage /> },
        { path: 'grad/:id', element: <GradProfilePage /> },
      ],
    },
    {
      path: 'login',
      element: <LoginPage signUp={false} />,
    }, {
      path: 'home',
      element: <HomePageNew signUp={false} />,
    },
    {
      path: 'signUp',
      element: <LoginPage signUp={true} />,
    },
    {
      element: <SimpleLayout />,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        { path: '404', element: <Page404 /> },
        { path: '*', element: <Navigate to="/404" /> },
        { path: 'connection/:id', element: <ConnectionPage /> },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}
