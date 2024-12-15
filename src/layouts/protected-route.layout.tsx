import { useCustomAuth } from "@/hooks/useCustomAuth";
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoutes() {
  const { isSignedIn } = useCustomAuth();
  return isSignedIn ? <Outlet /> : <Navigate to={"/"} replace />;
}
