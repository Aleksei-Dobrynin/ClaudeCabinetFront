import { API_URL_BGA } from "constants/config";
import CsrfHelper from './csrf-helper';
import axios from "axios";
import MainStore from "MainStore";
import { refreshToken } from "api/Auth/useAuth";
import i18n from "../i18n";

const http = axios.create({
  baseURL: API_URL_BGA,
  withCredentials: true, // Always include credentials for cross-origin requests
});

CsrfHelper.setupAxios(http);

// Flag to prevent multiple refresh token requests
let isRefreshing = false;
let failedQueue = [];

// Process the failed request queue based on token refresh success/failure
const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  
  failedQueue = [];
};

const SetupInterceptors = (http) => {
  http.interceptors.request.use(
    (config) => {
      // We don't need to manually set the Authorization header anymore
      // since the cookies will be sent automatically due to withCredentials: true
      
      config.headers["ngrok-skip-browser-warning"] = true;
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  http.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      const originalRequest = error.config;
      
      // Handle 401 errors (unauthorized)
      if (error?.response?.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
          // If token refresh is already in progress, queue this request
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then(() => {
              return http(originalRequest);
            })
            .catch(err => {
              return Promise.reject(err);
            });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          // Attempt to refresh the token
          await refreshToken();
          
          // If refresh succeeds, process the queue and retry the original request
          processQueue(null);
          isRefreshing = false;
          return http(originalRequest);
        } catch (refreshError) {
          // If refresh fails, process the queue with the error and redirect to login
          processQueue(refreshError);
          isRefreshing = false;
          
          // Redirect to login page
          window.location.href = "/login";
          return Promise.reject(refreshError);
        }
      }
      
      // Handle other error statuses
      if (error?.response) {
        console.log("Error with response:", error);

        if (error?.response?.status === 403) {
          const message = error.response?.data?.message;
          MainStore.openErrorDialog(message && message !== "" ? message : i18n.t('message.error.authorizationError'));
          return Promise.reject(error);
        } else if (error?.response?.status === 422) {
          let message = error.response?.data?.message;
          try {
            const json = JSON.parse(message);
            message = json?.ru;
          } catch (e) {
            // Parsing error, continue with original message
          }
          MainStore.openErrorDialog(
            message && message !== "" ? message : i18n.t('message.error.businessLogicError')
          );
          return Promise.reject(error);
        } else if (error?.response?.status === 404) {
          const message = error.response?.data?.message;
          MainStore.openErrorDialog(message && message !== "" ? message : i18n.t('message.error.notFoundError'));
          return Promise.reject(error);
        } else if (error?.response?.status === 400) {
          const message = error.response?.data?.message;
          MainStore.openErrorDialog(
            message && message !== ""
              ? message
              : i18n.t('message.error.validationError')
          );
          return Promise.reject(error);
        } else {
          return Promise.reject(error);
        }
      } else if (error.request) {
        console.log("Error with request:", error.request);
        return Promise.reject(error);
      } else {
        console.log("Request setup error:", error.message);
        return Promise.reject(error);
      }
    }
  );
};

SetupInterceptors(http);

const get = (url: string, headers = {}, params = {}) => {
  return http
    .get(url, {
      ...params,
      headers: {
        ...headers,
      },
    })
    .catch(function (error) {
      console.log("GET Error:");
      console.log(error.toJSON());
    });
};

const post = (url: string, data: any, headers = {}, params = {}) => {
  return http
    .post(url, data, {
      ...params,
      headers: {
        ...headers,
      },
    })
    .catch(function (error) {
      console.log("POST Error:");
      console.log(error.toJSON());
      return error;
    });
};

const put = (url: string, data: any, headers = {}) => {
  return http
    .put(url, data, {
      headers: {
        ...headers,
      },
    })
    .catch(function (error) {
      console.log("PUT Error:");
      console.log(error.toJSON());
      return error;
    });
};

const remove = (url: string, data: any, headers = {}) => {
  return http
    .delete(url, {
      headers: {
        ...headers,
      },
      data,
    })
    .catch(function (error) {
      console.log("DELETE Error:");
      console.log(error.toJSON());
    });
};

const patch = (url: string, data: any, headers = {}) => {
  return http
    .patch(url, data, {
      headers: {
        ...headers,
      },
    })
    .catch(function (error) {
      console.log("PATCH Error:");
      console.log(error.toJSON());
    });
};

const module = {
  http,
  get,
  post,
  put,
  remove,
  patch,
};

export default module;