import Dashboard from "../pages/admin/Dashboard";
import ManageOderList from "../pages/admin/ManageMenu/ManageOderList";
import TotalCustomer from "../pages/admin/ManageMenu/ToltalCustomer";
import TotalManager from "../pages/admin/ManageMenu/TotalManager";
import TotalStaff from "../pages/admin/ManageMenu/TotalStaff";
import Login from "../pages/common/Authentication/Login";
import Register from "../pages/common/Authentication/Register";
import ContactPage from "../pages/common/Contact";
import DetailPage from "../pages/common/Detail/DetailPage";
import Page401 from "../pages/common/ErrorPage/Page401";
import Page403 from "../pages/common/ErrorPage/Page403";
import Home from "../pages/common/Home/Home";
import Booking from "../pages/customer/booking/Booking";
import Profile from "../pages/customer/profile/Profile";
import CreateCombo from "../pages/manager/CreateCombo";
import DetailCombo from "../pages/manager/DetailCombo";
import DetailCustomer from "../pages/manager/DetailCustomer";

import DetailOrder from "../pages/manager/DetailOrder";

import ListCategory from "../pages/manager/ListCategory";
import ListCombo from "../pages/manager/ListCombo";
import ListOrder from "../pages/manager/ListOrder";
import ListProduct from "../pages/manager/ListProduct";
import ListStaff from "../pages/manager/ListStaff";
import ListTask from "../pages/manager/ListTask";
import ListUser from "../pages/manager/ListUser";
import UpdateCombo from "../pages/manager/UpdateCombo";
import StaffCalendar from "../pages/staff/StaffCalendar";

export const commonRoutes = [
  {
    path: "/login",
    element: <Login />,
    isWrapLayout: false,
  },
  {
    path: "/register",
    element: <Register />,
    isWrapLayout: false,
  },
  {
    path: "/contact",
    element: <ContactPage />,
    isWrapLayout: true,
  },
  {
    path: "/401",
    element: <Page401 />,
    isWrapLayout: false,
  },
  {
    path: "/403",
    element: <Page403 />,
    isWrapLayout: false,
  },
];

export const adminRoutes = [
  {
    path: "/admin-dashboard",
    element: <Dashboard />,
  },

  {
    path: "/manage-customers",
    element: <Home />,
  },
  {
    path: "/admin-manage-customers",
    element: <Home />,
  },
  {
    path: "/admin-manage-totalCustomer",
    element: <TotalCustomer />,
  },
  {
    path: "/admin-manage-totalStaff",
    element: <TotalStaff />,
  },
  {
    path: "/admin-manage-totalManager",
    element: <TotalManager />,
  },
  {
    path: "/admin-manage-oderList",
    element: <ManageOderList />,
  },
];

export const managerRoutes = [
  {
    path: "/manager-manage-customer",
    element: <ListUser />,
  },
  {
    path: "/manager-manage-customer/:id",
    element: <DetailCustomer />,
  },
  {
    path: "/manager-manage-staff",
    element: <ListStaff />,
  },
  {
    path: "/manager-manage-task",
    element: <ListTask />,
  },
  {
    path: "/manager-manage-combo",
    element: <ListCombo />,
  },
  {
    path: "/manager-manage-product",
    element: <ListProduct />,
  },
  {
    path: "/manager-manage-category",
    element: <ListCategory />,
  },
  {
    path: "/manager-manage-combo/:id",
    element: <DetailCombo />,
  },
  {
    path: "/manager-manage-combo/create-combo",
    element: <CreateCombo />,
  },
  {
    path: "/manager-manage-combo/update-combo/:id",
    element: <UpdateCombo />,
  },
  {
    path: "/manager-manage-order",
    element: <ListOrder />,
  },
  {
    path: "/manager-manage-order/:id",
    element: <DetailOrder />,
  },
];

export const customerRoutes = [
  {
    path: "/profile",
    element: <Profile />,
  },
  {
    path: "/booking",
    element: <Booking />,
    isWrapLayout: false,
  },
];

export const staffRoutes = [
  {
    path: "/staff-calendar",
    element: <StaffCalendar />,
  },
];
