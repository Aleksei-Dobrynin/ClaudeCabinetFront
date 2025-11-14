import React, { useEffect, useState } from "react";
import { observer } from "mobx-react";
import { useNavigate, useLocation } from "react-router-dom";
import { Backdrop, CircularProgress } from "@mui/material";
import AuthForm from "./AuthForm";
import store from "./store";

const Auth = observer(() => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    // Устанавливаем функцию навигации в store
    store.setNavigateFunction(navigate);
    
    const initializeAuth = async () => {
      try {
        // Инициализируем данные из localStorage (rememberMe)
        store.initFromStorage();
        
        // Проверяем наличие токена
        const token = localStorage.getItem("token");
        
        if (token) {
          // Если токен есть, проверяем его валидность
          const isAuthenticated = await store.checkAuth();
          
          if (isAuthenticated) {
            // Если токен валидный, перенаправляем на /user или на страницу откуда пришли
            const from = location.state?.from?.pathname || "/user";
            navigate(from, { replace: true });
            return;
          } else {
            // Если токен не валидный, удаляем его
            localStorage.removeItem("token");
            localStorage.removeItem("refreshToken");
          }
        }
      } catch (error) {
        console.error("Error during auth initialization:", error);
      } finally {
        setIsCheckingAuth(false);
      }
    };
    
    initializeAuth();
  }, [navigate, location]);

  const handleRegisterClick = () => {
    navigate("/register");
  };

  // Показываем загрузчик пока идет проверка авторизации
  if (isCheckingAuth) {
    return (
      <Backdrop sx={{ color: "#fff", zIndex: 1000000 }} open={true}>
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  // Показываем форму авторизации
  return (
    <AuthForm 
      store={store} 
      onRegisterClick={handleRegisterClick}
    />
  );
});

export default Auth;