import http from "../https";
export const getDarek = (propcode: string): Promise<any> => {
  return http.get(`/api/v1/MainBackAPI/Map/SearchAddressesByProp?propcode=${propcode}`);
};

export const getSearchDarek = (propcode: string): Promise<any> => {
  return http.get(`/api/v1/MainBackAPI/Map/SearchPropCodes?propcode=${propcode}`);
};
