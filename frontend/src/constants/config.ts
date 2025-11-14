const getApiBaseUrl = () => {
    const hostname = window.location.hostname;

    if (hostname.startsWith('10.') || hostname.startsWith('192.168.') || hostname === 'localhost') {
        return 'http://localhost:5014';
    }

    return 'http://212.42.97.122:5000/';
};

const getApiBaseUrlBga = () => {
    const hostname = window.location.hostname;

    if (hostname.startsWith('10.') || hostname.startsWith('192.168.') || hostname === 'localhost') {
        return 'https://localhost:5014';
    }

    return 'http://212.42.97.122:5000/';
};

export const API_URL_BGA = getApiBaseUrlBga();
// export const API_URL = getApiBaseUrl();
export const API_URL = 'http://localhost:5014/';
export const API_KEY_2GIS = '0b234cb6-6359-458d-bbcd-d023784a773a'
