import { makeAutoObservable, runInAction } from "mobx";
import i18n from "i18next";
import MainStore from "MainStore";
import { auth, logout, checkAuthStatus, authWithCredentials, login2f } from "api/Auth/useAuth";
import { forgotPassword } from "../../api/User";

interface UsbTokenData {
  tokenId: string;
  signature: string;
}

class AuthStore {
  error = "";
  isAuthenticated = false;
  navigate = (path) => {};
  rememberMe = false;
  code = "";
  errorCode = "";
  isShowCodeVerify = false;

  pin = "";

  email = "";
  password = "";
  emailError = "";
  passwordError = "";

  constructor() {
    makeAutoObservable(this);
  }

  setNavigateFunction(navigate) {
    this.navigate = navigate;
  }

  handleChange(event) {
    const { name, value } = event.target;
    
    if (name === "rememberMe") {
      this.rememberMe = value;
    } else {
      this[name] = value;
    }
    
    if (name === "email") {
      this.emailError = "";
    } else if (name === "password") {
      this.passwordError = "";
    } else if (name === "pin") {
      this.error = "";
    }
  }

  async simulateUsbToken() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ tokenId: "SIMULATED_TOKEN_123", signature: "SIMULATED_SIGNATURE" });
      }, 1000);
    });
  }

  validateCredentials() {
    let isValid = true;
    
    if (!this.email || !this.email.includes('@')) {
      this.emailError = i18n.t("message:error.authenticationError");
      isValid = false;
    }
    
    if (!this.password || this.password.length < 6) {
      this.passwordError = i18n.t("message:error.passwordMin");
      isValid = false;
    }
    
    return isValid;
  }

  // Улучшенный метод проверки авторизации
  checkAuth = async () => {
    try {
      // Проверяем наличие токена в localStorage
      const token = localStorage.getItem("token");
      
      if (!token) {
        runInAction(() => {
          this.isAuthenticated = false;
        });
        return false;
      }

      // Вызываем API для проверки валидности токена
      const response = await checkAuthStatus();

      // Проверяем статус ответа
      if (response && response.status === 200) {
        runInAction(() => {
          this.isAuthenticated = true;
        });
        
        // Если в ответе есть данные пользователя, можем их сохранить
        if (response.data) {
          const userData = response.data;
          if (userData.Name) {
            localStorage.setItem("currentUser", userData.Name);
          }
        }
        
        return true;
      } else {
        // Если токен не валидный, очищаем localStorage
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("currentUser");
        
        runInAction(() => {
          this.isAuthenticated = false;
        });
        
        return false;
      }
    } catch (error) {
      console.error("Error checking authentication:", error);
      
      // В случае ошибки (например, 401) очищаем данные авторизации
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("currentUser");
      
      runInAction(() => {
        this.isAuthenticated = false;
      });
      
      return false;
    }
  };

  onTokenLogin = async () => {
    try {
      MainStore.changeLoader(true);
      
      if (!this.pin) {
        runInAction(() => {
          this.error = i18n.t("message:error.fieldRequired");
        });
        MainStore.changeLoader(false);
        return;
      }
      
      const tokenData = await this.simulateUsbToken();

      const data = {
        Pin: this.pin,
        TokenId: "1",
        Signature: "2",
        DeviceId: "device_id",
      };

      const response = this.isShowCodeVerify ? await login2f(data, this.code) : await auth(data);

      if (response.status === 201 || response.status === 200) {
        runInAction(() => {
          this.isAuthenticated = true;
        });
        
        // Сохраняем токены
        localStorage.setItem("token", response.data.access_token || response.data.accessToken);
        if (response.data.refresh_token || response.data.refreshToken) {
          localStorage.setItem("refreshToken", response.data.refresh_token || response.data.refreshToken);
        }
        localStorage.setItem("authMethod", "token");

        // Загружаем информацию о пользователе
        await MainStore.getCurrentUserInfo();
        
        // Перенаправляем на /user
        this.navigate("/user");
        this.clearStore();
      } else {
        throw new Error("Authentication failed");
      }
    } catch (err) {
      runInAction(() => {
        this.error = i18n.t("message:error.authenticationError");
      });
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  onCredentialsLogin = async () => {
    try {
      MainStore.changeLoader(true);
      
      if (!this.validateCredentials()) {
        MainStore.changeLoader(false);
        return;
      }

      const data = {
        Email: this.email,
        Password: this.password,
        DeviceId: "device_id",
        Code: this.code,
      };

      const response = await authWithCredentials(data);

      if (response.status === 201 || response.status === 200) {
        console.log("Login response:", response);
        
        // Проверка двухфакторной аутентификации
        if (response.data.requires_two_factor) {
          runInAction(() => {
            this.isShowCodeVerify = true;
            this.code = '';
          });
          MainStore.changeLoader(false);
          return;
        }
        
        runInAction(() => {
          this.isAuthenticated = true;
        });
        
        // Сохраняем токены
        localStorage.setItem("token", response.data.access_token || response.data.accessToken);
        if (response.data.refresh_token || response.data.refreshToken) {
          localStorage.setItem("refreshToken", response.data.refresh_token || response.data.refreshToken);
        }
        localStorage.setItem("authMethod", "credentials");
        
        // Сохраняем email если включен "Запомнить меня"
        if (this.rememberMe) {
          localStorage.setItem("rememberedEmail", this.email);
        } else {
          localStorage.removeItem("rememberedEmail");
        }

        // Загружаем информацию о пользователе
        await MainStore.getCurrentUserInfo();
        
        // Перенаправляем на /user
        this.navigate("/user");
        this.clearStore();
      } else {
        throw new Error("Authentication failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      runInAction(() => {
        this.emailError = i18n.t("message:error.authenticationError");
        this.passwordError = i18n.t("message:error.authenticationError");
      });
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  onForgotPassword = async () => {
    try {
      MainStore.changeLoader(true);

      if (!this.email || !this.email.includes('@')) {
        runInAction(() => {
          this.emailError = i18n.t("message:error.authenticationError");
        });
        MainStore.changeLoader(false);
        return;
      }

      const data = {
        Email: this.email?.trim(),
        DeviceId: "device_id",
      };

      const response = await forgotPassword(data);

      if (response.status === 201 || response.status === 200) {
        this.clearStore();
        MainStore.setSnackbar(i18n.t("message:recoveryPasswordSendEmail"), "success");
      } else {
        throw new Error("Password reset failed");
      }
    } catch (err) {
      runInAction(() => {
        this.emailError = i18n.t("message:recoveryPasswordFailSendEmail");
      });
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  onLogout = async () => {
    try {
      MainStore.changeLoader(true);
      
      // Вызываем API для logout
      await logout();
      
      // Очищаем все данные авторизации
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("authMethod");
      localStorage.removeItem("currentUser");

      runInAction(() => {
        this.isAuthenticated = false;
      });

      // Перенаправляем на страницу логина
      if (this.navigate) {
        this.navigate("/login");
      } else {
        window.location.href = "/login";
      }

    } catch (error) {
      console.error("Logout failed:", error);
      
      // Даже если API вернул ошибку, все равно очищаем локальные данные
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("authMethod");
      localStorage.removeItem("currentUser");
      
      runInAction(() => {
        this.isAuthenticated = false;
      });
      
      // Перенаправляем на страницу логина
      if (this.navigate) {
        this.navigate("/login");
      } else {
        window.location.href = "/login";
      }
      
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  clearStore = () => {
    runInAction(() => {
      this.pin = "";
      this.email = "";
      this.password = "";
      this.error = "";
      this.emailError = "";
      this.passwordError = "";
      this.code = "";
      this.errorCode = "";
      this.isShowCodeVerify = false;
      // Не сбрасываем rememberMe, чтобы сохранить выбор пользователя
    });
  };

  initFromStorage = () => {
    const rememberedEmail = localStorage.getItem("rememberedEmail");
    if (rememberedEmail) {
      runInAction(() => {
        this.email = rememberedEmail;
        this.rememberMe = true;
      });
    }
  };
}

export default new AuthStore();