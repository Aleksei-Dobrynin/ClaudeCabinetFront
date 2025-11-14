import { API_URL } from "constants/config";
import axios from "axios";
import MainStore from "MainStore";

const http = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

const httpBlob = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

const SetupInterceptors = (http) => {
  http.interceptors.request.use(
    (config) => {
      const accessToken = localStorage.getItem("token");
      if (accessToken) {
        //@ts-ignore
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${accessToken}`,
        };
      }
      config.headers["ngrok-skip-browser-warning"] = true;
      return config;
    },
    (error) => {
      Promise.reject(error);
    }
  );

  http.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      console.log("Ошибка");

      if (error?.response) {
        console.log("Ошибка с response");
        console.log(error);

        const { status, data } = error.response;

        // НОВЫЙ ОБРАБОТЧИК: ServiceUnavailable (503) - недоступность внешних сервисов
        if (status === 503) {
          let message = "";
          
          if (data?.isTimeout) {
            const serviceName = data?.serviceName || "Внешний сервис";
            message = `${serviceName} не отвечает. Превышено время ожидания (10 секунд). Пожалуйста, попробуйте позже.`;
          } else {
            message = data?.message || "Внешний сервис временно недоступен. Пожалуйста, попробуйте позже.";
          }
          
          MainStore.openErrorDialog(message);
          return Promise.reject(error);
        }
        
        // НОВЫЙ ОБРАБОТЧИК: Timeout (408)
        if (status === 408) {
          const message = data?.message || "Превышено время ожидания ответа от сервиса. Пожалуйста, попробуйте позже.";
          MainStore.openErrorDialog(message);
          return Promise.reject(error);
        }
        
        // НОВЫЙ ОБРАБОТЧИК: Bad Gateway (502)
        if (status === 502) {
          const message = data?.message || "Не удалось подключиться к внешнему сервису. Проверьте подключение к интернету или попробуйте позже.";
          MainStore.openErrorDialog(message);
          return Promise.reject(error);
        }

        // Все остальное остается как было
        if (error?.response?.status === 401) {
          console.log("Ошибка 401");

          localStorage.removeItem("token");
          localStorage.removeItem("currentUser");
          window.location.href = "/login";

          return Promise.reject(error);
        } else if (error?.response?.status === 403) {
          const message = error.response?.data?.message;
          MainStore.openErrorDialog(message && message !== "" ? message : "У вас нет доступа!");
          return Promise.reject(error);
        } else if (error?.response?.status === 422) {
          let message = error.response?.data?.message;
          try {
            const json = JSON.parse(message);
            message = json?.ru
          } catch (e) {
          }
          MainStore.openErrorDialog(
            message && message !== "" ? message : "Ошибка логики, обратитесь к администратору!"
          );
          return Promise.reject(error);
        } else if (error?.response?.status === 404) {
          const message = error.response?.data?.message;
          MainStore.openErrorDialog(message && message !== "" ? message : "Страница не найдена!");
          return Promise.reject(error);
        } else if (error?.response?.status === 400) {
          const message = error.response?.data?.message;
          MainStore.openErrorDialog(
            message && message !== ""
              ? message
              : "Не правильно отправлены данные, обратитесь к администратору!"
          );
          return Promise.reject(error);
        } else {
          return Promise.reject(error);
        }
      } else if (error.request) {
        console.log("Ошибка с request");
        console.log(error);
        console.log(error.request);
        return Promise.reject(error);
      } else {
        console.log("Произошла ошибка настройки запроса:", error.message);
        return Promise.reject(error);
      }
    }
  );
};

const SetupBlobInterceptors = (httpBlob) => {
  httpBlob.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      config.headers["ngrok-skip-browser-warning"] = true;
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  httpBlob.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error?.response?.status === 401) {
        window.location.href = "/login";
      }
      return Promise.reject(error);
    }
  );
};

SetupInterceptors(http);
SetupBlobInterceptors(httpBlob);

const get = (url: string, headers = {}, params = {}) => {
  return http
    .get(url, {
      ...params,
      headers: {
        ...headers,
      },
    })
    .catch(function (error) {
      console.log("Ошибка GET");
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
      console.log("Ошибка POST");
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
      console.log("Ошибка PUT");
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
      console.log("Ошибка REMOVE");
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
      console.log("Ошибка PATCH");
      console.log(error.toJSON());
    });
};

const downloadBlob = async (url: string, headers = {}) => {
  try {
    const response = await httpBlob.get(url, {
      responseType: 'blob',
      headers: {
        ...headers,
      },
    });

    if (response.data instanceof Blob) {
      return response;
    } else {
      const blob = new Blob([response.data]);
      return {
        ...response,
        data: blob
      };
    }
  } catch (error) {
    console.error("Download Blob Error:", error);
    throw error;
  }
};

const downloadFile = async (url: string, params = {}, headers = {}) => {
  const token = localStorage.getItem("token");

  let fullUrl = API_URL + url;
  const queryParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    queryParams.append(key, String(value));
  });

  const queryString = queryParams.toString();
  if (queryString) {
    fullUrl += (fullUrl.includes('?') ? '&' : '?') + queryString;
  }

  const requestHeaders = {
    'Authorization': token ? `Bearer ${token}` : '',
    'ngrok-skip-browser-warning': 'true',
    ...headers
  };

  try {
    const response = await fetch(fullUrl, {
      method: 'GET',
      headers: requestHeaders,
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error('Ошибка при загрузке файла');
    }

    try {
      const data = await response.json();
      
      if (!data || (!data.file_contents && !data.content)) {
        throw new Error('Содержимое файла отсутствует');
      }

      const fileContent = data.file_contents || data.content;
      const fileName = data.file_download_name || data.fileName || 'download';
      const contentType = data.content_type || data.contentType || 'application/octet-stream';

      const byteCharacters = atob(fileContent);
      const byteArray = new Uint8Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteArray[i] = byteCharacters.charCodeAt(i);
      }

      const blob = new Blob([byteArray], { type: contentType });
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = blobUrl;
      link.setAttribute('download', fileName);

      document.body.appendChild(link);
      link.click();

      setTimeout(() => {
        window.URL.revokeObjectURL(blobUrl);
        document.body.removeChild(link);
      }, 100);

      return true;
    } catch (jsonError) {
      // If JSON parsing fails, try to handle as blob
      const blob = await response.blob();
      let fileName = 'download';
      const contentDisposition = response.headers.get('content-disposition');
      if (contentDisposition) {
        const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
        const matches = filenameRegex.exec(contentDisposition);
        if (matches != null && matches[1]) {
          fileName = matches[1].replace(/['"]/g, '');
        }
      }

      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = blobUrl;
      link.setAttribute('download', fileName);

      document.body.appendChild(link);
      link.click();

      setTimeout(() => {
        window.URL.revokeObjectURL(blobUrl);
        document.body.removeChild(link);
      }, 100);

      return true;
    }
  } catch (error) {
    console.error('Ошибка загрузки файла:', error);
    MainStore.openErrorDialog('Не удалось загрузить файл');
    return Promise.reject(error);
  }
};

const module = {
  http,
  get,
  post,
  put,
  remove,
  patch,
  downloadFile,
  downloadBlob,
};

export default module;