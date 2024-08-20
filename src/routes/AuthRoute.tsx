import { useContext } from "react";
import { useLocation, Navigate, Outlet } from "react-router-dom";
import { UserContext } from "../context/AuthContext";

const AuthRoute = ({ allowedRoles }: any) => {
  const currentUser = useContext(UserContext);
  const location = useLocation();
  console.log({ currentUser });

  return allowedRoles?.includes(currentUser?.user?.role) ? (
    <Outlet />
  ) : currentUser?.user ? (
    <Navigate to="/403" state={{ from: location }} replace />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};
export default AuthRoute;
