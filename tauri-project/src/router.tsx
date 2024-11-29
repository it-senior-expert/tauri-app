import { createBrowserRouter } from 'react-router-dom';
import SidebarLayout from '@/components/Common/Layouts/SidebarLayout';
import DashboardPage from '@/pages/DashboardPage';

const MainRouter = createBrowserRouter([
  {
    path: '/',
    element: <SidebarLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
    ],
  },
]);

export default MainRouter;
