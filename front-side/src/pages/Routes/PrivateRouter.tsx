import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { UserContext } from "../../hooks/UserContext";


export const PrivateRoute = () => {
  const { isAuth, checkUserAuth } = useContext(UserContext);
  checkUserAuth();
  return isAuth == (200 || 201) ? <Outlet/> : isAuth == 0 ? <Outlet/> : <Navigate to="/login" replace />;
};
