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

// Вспомогательная функция для извлечения имени файла из Content-Disposition
const extractFileName = (contentDisposition: string | null): string => {
  if (!contentDisposition) {
    console.warn('Content-Disposition заголовок отсутствует');
    return 'download';
  }
  
  console.log('Content-Disposition:', contentDisposition);
  
  // Сначала пробуем UTF-8 версию (filename*=UTF-8''...)
  const utf8Match = contentDisposition.match(/filename\*=UTF-8''([^;]+)/i);
  if (utf8Match && utf8Match[1]) {
    try {
      const decoded = decodeURIComponent(utf8Match[1]);
      console.log('Имя файла (UTF-8):', decoded);
      return decoded;
    } catch (e) {
      console.error('Ошибка декодирования UTF-8 имени файла:', e);
    }
  }
  
  // Затем пробуем обычную версию (filename="..." или filename=...)
  const normalMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/i);
  if (normalMatch && normalMatch[1]) {
    let filename = normalMatch[1].replace(/['"]/g, '');
    console.log('Имя файла (обычное):', filename);
    return filename;
  }
  
  // Альтернативный формат: filename*=utf-8''...
  const altUtf8Match = contentDisposition.match(/filename\*=utf-8''([^;]+)/i);
  if (altUtf8Match && altUtf8Match[1]) {
    try {
      const decoded = decodeURIComponent(altUtf8Match[1]);
      console.log('Имя файла (альтернативный UTF-8):', decoded);
      return decoded;
    } catch (e) {
      console.error('Ошибка декодирования альтернативного UTF-8:', e);
    }
  }
  
  console.warn('Не удалось извлечь имя файла из Content-Disposition');
  return 'download';
};

// Вспомогательная функция для определения MIME типа по имени файла
const getMimeTypeFromFileName = (fileName: string): string => {
  const extension = fileName.toLowerCase().split('.').pop();
  
  const mimeTypes: { [key: string]: string } = {
    'pdf': 'application/pdf',
    'png': 'image/png',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'gif': 'image/gif',
    'svg': 'image/svg+xml',
    'doc': 'application/msword',
    'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'xls': 'application/vnd.ms-excel',
    'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'zip': 'application/zip',
    'rar': 'application/x-rar-compressed',
    'txt': 'text/plain',
  };
  
  return mimeTypes[extension || ''] || 'application/octet-stream';
};

// NEW: Потоковая загрузка с прогрессом для СКАЧИВАНИЯ файла
const downloadFileStream = async (
  url: string,
  onProgress?: (progress: number) => void, 
  headers = {}
) => {
  const token = localStorage.getItem("token");
  const fullUrl = API_URL + url;

  const requestHeaders = {
    'Authorization': token ? `Bearer ${token}` : '',
    'ngrok-skip-browser-warning': 'true',
    ...headers
  };

  console.log('Запрос на скачивание файла:', fullUrl);

  try {
    const response = await fetch(fullUrl, {
      method: 'GET',
      headers: requestHeaders,
      credentials: 'include'
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("currentUser");
        window.location.href = "/login";
        throw new Error('Не авторизован');
      }
      if (response.status === 404) {
        throw new Error('Файл не найден');
      }
      if (response.status === 403) {
        throw new Error('Доступ запрещен');
      }
      if (response.status === 500) {
        throw new Error('Ошибка сервера при загрузке файла');
      }
      throw new Error(`Ошибка загрузки: ${response.status}`);
    }

    const contentLength = response.headers.get('Content-Length');
    const contentDisposition = response.headers.get('Content-Disposition');
    const contentType = response.headers.get('Content-Type');
    
    console.log('Content-Type:', contentType);
    console.log('Content-Length:', contentLength);
    console.log('Content-Disposition:', contentDisposition);
    
    const fileName = extractFileName(contentDisposition);
    console.log('Извлеченное имя файла:', fileName);
    
    const total = contentLength ? parseInt(contentLength, 10) : 0;
    let loaded = 0;

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('Не удалось получить reader из response');
    }

    const chunks: Uint8Array[] = [];

    while (true) {
      const { done, value } = await reader.read();
      
      if (done) break;
      
      chunks.push(value);
      loaded += value.length;

      if (onProgress && total > 0) {
        const progress = Math.round((loaded / total) * 100);
        onProgress(progress);
      }
    }

    console.log('Загружено chunks:', chunks.length, 'Размер:', loaded);

    // Определяем MIME тип
    const mimeType = contentType || getMimeTypeFromFileName(fileName);
    console.log('MIME тип для blob:', mimeType);
    
    const blob = new Blob(chunks as BlobPart[], { type: mimeType });
    const blobUrl = window.URL.createObjectURL(blob);

    console.log('Создан blob URL:', blobUrl);
    console.log('Имя файла для скачивания:', fileName);

    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();

    setTimeout(() => {
      window.URL.revokeObjectURL(blobUrl);
      document.body.removeChild(link);
    }, 100);

    return {
      success: true,
      fileName: fileName
    };
  } catch (error: any) {
    console.error('Ошибка загрузки файла:', error);
    
    let errorMessage = 'Не удалось загрузить файл';
    if (error.message === 'Файл не найден') {
      errorMessage = 'Файл не найден';
    } else if (error.message === 'Доступ запрещен') {
      errorMessage = 'У вас нет доступа к этому файлу';
    } else if (error.message.includes('Ошибка сервера')) {
      errorMessage = 'Ошибка сервера при загрузке файла';
    }
    
    MainStore.openErrorDialog(errorMessage);
    throw error;
  }
};

// NEW: Потоковая загрузка для ПРОСМОТРА файла (возвращает blob URL и метаданные)
const openFileStream = async (
  url: string,
  onProgress?: (progress: number) => void, 
  headers = {}
): Promise<{
  blobUrl: string;
  fileName: string;
  mimeType: string;
}> => {
  const token = localStorage.getItem("token");
  const fullUrl = API_URL + url;

  const requestHeaders = {
    'Authorization': token ? `Bearer ${token}` : '',
    'ngrok-skip-browser-warning': 'true',
    ...headers
  };

  console.log('Запрос на просмотр файла:', fullUrl);

  try {
    const response = await fetch(fullUrl, {
      method: 'GET',
      headers: requestHeaders,
      credentials: 'include'
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("currentUser");
        window.location.href = "/login";
        throw new Error('Не авторизован');
      }
      if (response.status === 404) {
        throw new Error('Файл не найден');
      }
      if (response.status === 403) {
        throw new Error('Доступ запрещен');
      }
      if (response.status === 500) {
        throw new Error('Ошибка сервера при открытии файла');
      }
      throw new Error(`Ошибка открытия файла: ${response.status}`);
    }

    const contentLength = response.headers.get('Content-Length');
    const contentDisposition = response.headers.get('Content-Disposition');
    const contentType = response.headers.get('Content-Type');
    
    console.log('Content-Type:', contentType);
    console.log('Content-Length:', contentLength);
    console.log('Content-Disposition:', contentDisposition);
    
    const fileName = extractFileName(contentDisposition);
    console.log('Извлеченное имя файла:', fileName);
    
    const mimeType = contentType || getMimeTypeFromFileName(fileName);
    console.log('Определенный MIME тип:', mimeType);
    
    const total = contentLength ? parseInt(contentLength, 10) : 0;
    let loaded = 0;

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('Не удалось получить reader из response');
    }

    const chunks: Uint8Array[] = [];

    while (true) {
      const { done, value } = await reader.read();
      
      if (done) break;
      
      chunks.push(value);
      loaded += value.length;

      if (onProgress && total > 0) {
        const progress = Math.round((loaded / total) * 100);
        onProgress(progress);
      }
    }

    console.log('Загружено chunks:', chunks.length, 'Размер:', loaded);

    // Конвертируем chunks в Blob с правильным MIME типом (исправление TypeScript ошибки)
    const blob = new Blob(chunks as BlobPart[], { type: mimeType });
    const blobUrl = window.URL.createObjectURL(blob);

    console.log('Создан blob URL для просмотра:', blobUrl);

    return {
      blobUrl,
      fileName,
      mimeType
    };
  } catch (error: any) {
    console.error('Ошибка открытия файла:', error);
    
    let errorMessage = 'Не удалось открыть файл';
    if (error.message === 'Файл не найден') {
      errorMessage = 'Файл не найден';
    } else if (error.message === 'Доступ запрещен') {
      errorMessage = 'У вас нет доступа к этому файлу';
    } else if (error.message.includes('Ошибка сервера')) {
      errorMessage = 'Ошибка сервера при открытии файла';
    }
    
    MainStore.openErrorDialog(errorMessage);
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
  downloadFileStream, // Для скачивания с прогрессом
  openFileStream, // Для просмотра с прогрессом
};

export default module;