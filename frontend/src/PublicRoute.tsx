import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import MainStore from "./MainStore";
import { Backdrop, CircularProgress } from "@mui/material";
import { observer } from "mobx-react";
import ConfirmDialog from "components/ConfirmDialog";
import AuthStore from "features/Auth/store";

const PublicRoute = observer(() => {
    const location = useLocation();
    const [isChecking, setIsChecking] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const checkAuthentication = async () => {
            setIsChecking(true);
            try {
                // Проверяем наличие токена в localStorage
                const token = localStorage.getItem("token");
                
                if (token) {
                    // Если токен есть, проверяем его валидность через API
                    const authenticated = await AuthStore.checkAuth();
                    setIsAuthenticated(authenticated);
                } else {
                    // Если токена нет, сразу считаем что пользователь не авторизован
                    setIsAuthenticated(false);
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

    // Если пользователь авторизован, редиректим на /user
    if (isAuthenticated) {
        // Получаем путь откуда пришел пользователь или используем /user по умолчанию
        const from = location.state?.from?.pathname || "/user";
        return <Navigate to={from} state={{ from: location }} replace />;
    }

    // Если не авторизован, показываем публичные страницы
    return (
        <>
            <ConfirmDialog />
            <Backdrop id="Preloader_1" sx={{ color: "#fff", zIndex: 1000000 }} open={MainStore.loader}>
                <CircularProgress color="inherit" />
            </Backdrop>
            <Outlet />
        </>
    );
});

export default PublicRoute;