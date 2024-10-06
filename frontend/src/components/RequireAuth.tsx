import { useAppSelector } from "../hooks/reduxHooks";
import { useLocation, Navigate, Outlet } from "react-router-dom";

const RequireAuth = () => {
  const location = useLocation();
  const data = useAppSelector((state) => state.auth);

  return data.token.length > 0 ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default RequireAuth;
