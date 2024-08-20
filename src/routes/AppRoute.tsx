import { Route, Routes } from "react-router-dom";
import {
  adminRoutes,
  customerRoutes,
  commonRoutes,
  managerRoutes,
  staffRoutes,
} from "./RouteByRole";
import { ROLES } from "./roles";
import AuthRoute from "./AuthRoute";
import Sidebar from "../components/common/sidebar/Sidebar";
import WrapLayoutCustomer from "../components/common/wrapper/WrapLayoutCustomer";
import Page404 from "../pages/common/ErrorPage/Page404";
import Home from "../pages/common/Home/Home";
import CheckAuthenticate from "../components/common/wrapper/CheckAuthenticate";
import DetailPage from "../pages/common/Detail/DetailPage";
import Booking from "../pages/customer/booking/Booking";
import SpaCompoPage from "../pages/common/SpaCompoPage/SpaCompoPage";
import DetailSpaCompoPage from "../pages/common/DetailSpaCompoPage/DetailSpaCompoPage";
import CartSummary from "../pages/customer/CartSummary/CartSummary";

type commonRouteType = {
  path: string;
  element: JSX.Element;
  isWrapLayout: boolean;
};
const AppRoutes = () => {
  return (
    <Routes>
      {commonRoutes.map((route: commonRouteType, index: any) => {
        if (route.path === "/login")
          return (
            <Route key={"check_auth"} element={<CheckAuthenticate />}>
              <Route
                key={route.path}
                path={route.path}
                element={route.element}
              />
            </Route>
          );
        if (route.isWrapLayout) {
          return (
            <Route key={"wrap_layout2"} element={<WrapLayoutCustomer />}>
              <Route
                key={route.path}
                path={route.path}
                element={route.element}
              />
            </Route>
          );
        } else
          return (
            <Route key={route.path} path={route.path} element={route.element} />
          );
      })}

      {/* Customer routes with protected */}

      <Route key={"wrap_layout2"} element={<WrapLayoutCustomer />}>
        <Route path={"/"} element={<Home />} />;
        <Route path={"/:id"} element={<DetailPage />} />;
        <Route path="/spa-services" element={<SpaCompoPage />} />;
        <Route path="/spa-services/:id" element={<DetailSpaCompoPage />} />;
        <Route
          key={"customer_private"}
          element={<AuthRoute allowedRoles={[ROLES.CUSTOMER]} />}
        >
          {customerRoutes.map((route: any, index: any) => {
            return (
              <Route
                key={route.path}
                path={route.path}
                element={route.element}
              />
            );
          })}
        </Route>
        <Route path="/my-cart" element={<CartSummary />} />
      </Route>

      {/* Admin routes with protected */}
      <Route
        key={"admin_private"}
        element={<AuthRoute allowedRoles={[ROLES.ADMIN]} />}
      >
        <Route element={<Sidebar />}>
          {adminRoutes.map((route, index) => {
            return (
              <Route
                key={route.path}
                path={route.path}
                element={route.element}
              />
            );
          })}
        </Route>
      </Route>

      {/* Manager routes with protected */}
      <Route
        key={"manager_private"}
        element={<AuthRoute allowedRoles={[ROLES.MANAGER]} />}
      >
        <Route element={<Sidebar />}>
          {managerRoutes.map((route, index) => {
            return (
              <Route
                key={route.path}
                path={route.path}
                element={route.element}
              />
            );
          })}
        </Route>
      </Route>

      {/* Staff routes with protected */}
      <Route
        key={"staff_private"}
        element={<AuthRoute allowedRoles={[ROLES.STAFF]} />}
      >
        <Route element={<Sidebar />}>
          {staffRoutes.map((route, index) => {
            return (
              <Route
                key={route.path}
                path={route.path}
                element={route.element}
              />
            );
          })}
        </Route>
      </Route>

      {/* Routes not exist */}
      <Route path="*" element={<Page404 />} />
    </Routes>
  );
};

export default AppRoutes;
