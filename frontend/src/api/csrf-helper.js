/**
 * Вспомогательный модуль для работы с CSRF токенами на клиенте
 */
export default class CsrfHelper {
  /**
   * Получает CSRF токен из cookies
   * @returns {string|null} CSRF токен или null если токен не найден
   */
  static getToken() {
    return this.getCookie('XSRF-TOKEN');
  }

  /**
   * Получает значение cookie по имени
   * @param {string} name Имя cookie
   * @returns {string|null} Значение cookie или null если cookie не найдена
   */
  static getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  }

  /**
   * Добавляет CSRF токен к Fetch или Axios запросу
   * @param {object} config Конфигурация запроса
   * @returns {object} Обновленная конфигурация с токеном
   */
  static addCsrfToken(config = {}) {
    const token = this.getToken();
    if (!token) return config;

    // Для Fetch API
    if (!config.headers) {
      config.headers = {};
    }

    config.headers['X-XSRF-TOKEN'] = token;
    return config;
  }

  /**
   * Настройка Axios для автоматического добавления CSRF токена ко всем запросам
   * @param {object} axios Экземпляр Axios
   */
  static setupAxios(axios) {
    axios.interceptors.request.use(config => {
      return this.addCsrfToken(config);
    });
  }

  /**
   * Создает Fetch функцию с добавлением CSRF токена
   * @returns {Function} Обертка для fetch с автоматическим добавлением CSRF токена
   */
  static createFetchWithCsrf() {
    const originalFetch = window.fetch;

    return function fetchWithCsrf(url, options = {}) {
      if (!options.headers) {
        options.headers = {};
      }

      const token = CsrfHelper.getToken();
      if (token) {
        options.headers['X-XSRF-TOKEN'] = token;
      }

      return originalFetch(url, options);
    };
  }

  /**
   * Устанавливает глобальную обертку для fetch с CSRF защитой
   */
  static enableGlobalFetchProtection() {
    window.fetch = this.createFetchWithCsrf();
  }
}

// Пример использования:
//
// 1. С Axios:
// import axios from 'axios';
// import CsrfHelper from './csrf-helper';
//
// CsrfHelper.setupAxios(axios);
//
// 2. С Fetch API:
// import CsrfHelper from './csrf-helper';
//
// // Вариант 1: Заменить глобальный fetch
// CsrfHelper.enableGlobalFetchProtection();
//
// // Вариант 2: Использовать отдельную функцию
// const fetchWithCsrf = CsrfHelper.createFetchWithCsrf();
// fetchWithCsrf('/api/data', { method: 'POST', body: JSON.stringify(data) });