import { checkCookie } from "@/lib/SecureCredentiels";
import { logout } from "@/state/auth/AuthSlice";
import { RootState } from "@/state/store";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";

const RootLayout: React.FC = () => {
  const stateCode = useSelector((state: RootState) => state.auth.code)
  const isLogin = useSelector((state: RootState) => state.auth.isLogin)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    if (!checkCookie("user", stateCode)) {
      dispatch(logout())
      navigate("/login")
    }else{
      navigate("/scrapy")
    }
  }, [isLogin])
  return (
    <div className="min-h-[100vh] overflow-hidden">
      <Outlet />
    </div>
  );
};

export default RootLayout;