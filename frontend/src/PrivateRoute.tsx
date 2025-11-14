import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import MainStore from "./MainStore";
import { Backdrop, CircularProgress } from "@mui/material";
import { observer } from "mobx-react";
import ConfirmDialog from "components/ConfirmDialog";
import AuthStore from "features/Auth/store";
import OrganizationSelectDialog from "./companyselect";

const PrivateRoute = observer(() => {
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuthentication = async () => {
      setIsChecking(true);
      try {
        // Проверяем наличие токена
        const token = localStorage.getItem("token");
        
        if (!token) {
          // Если токена нет, сразу считаем что пользователь не авторизован
          setIsAuthenticated(false);
        } else {
          // Если токен есть, проверяем его валидность
          const authenticated = await AuthStore.checkAuth();
          setIsAuthenticated(authenticated);
          
          if (authenticated) {
            // Если авторизован, загружаем данные пользователя
            await MainStore.getCurrentUserInfo();
          } else {
            // Если токен невалидный, очищаем localStorage
            localStorage.removeItem("token");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("currentUser");
          }
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        setIsAuthenticated(false);
      } finally {
        setIsChecking(false);
      }
    };

    checkAuthentication();
  }, []);

  // Показываем загрузчик пока идет проверка
  if (isChecking) {
    return (
      <Backdrop sx={{ color: "#fff", zIndex: 1000000 }} open={true}>
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  // Если не авторизован, редиректим на логин
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Если авторизован, показываем приватные страницы
  return (
    <>
      <ConfirmDialog />
      <OrganizationSelectDialog
        open={MainStore.openSelectCompany}
        onClose={() => {
          MainStore.openSelectCompany = false;
        }}
        onSelect={(company) => {
          MainStore.selectCurrentCompany(company);
        }}
      />
      <Backdrop id="Preloader_1" sx={{ color: "#fff", zIndex: 1000000 }} open={MainStore.loader}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Outlet />
    </>
  );
});

export default PrivateRoute;