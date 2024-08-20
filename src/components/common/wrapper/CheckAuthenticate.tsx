import React, { useContext } from "react";
import { UserContext } from "../../../context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";
import { ROLES } from "../../../routes/roles";

const CheckAuthenticate = () => {
  const currentUser = useContext(UserContext);

  if (!currentUser.user)
    return (
      <>
        <Outlet />
      </>
    );
  else if (currentUser.user.role === ROLES.ADMIN)
    return <Navigate to="/admin-dashboard" />;
  else if (currentUser.user.role === ROLES.MANAGER)
    return <Navigate to="/manager-manage-order" />;
  else if (
    currentUser.user.role === ROLES.STAFF ||
    currentUser.user.role === ROLES.CUSTOMER
  )
    return <Navigate to="/" />;
  else return <Outlet />;
};

export default CheckAuthenticate;
