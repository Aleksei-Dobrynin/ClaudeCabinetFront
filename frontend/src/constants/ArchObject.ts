import { Dayjs } from "dayjs";
import { ArchObjectTag } from "./ArchObjectTag";

export type ArchObject = {
  id: number;
  districtId?: number;
  address: string;
  name: string;
  address_street?: string;
  tunduk_district_id?: number;
  tunduk_residential_area_id?: number;
  tunduk_street_id?: number;
  tunduk_address_unit_id?: number;
  tunduk_building_id?: number;
  district_id?: number;
  tunduk_building_num?: string;
  tunduk_flat_num?: string;
  open?: boolean;
  is_manual?: boolean;
  tunduk_uch_num?: string;
  address_building?: string;
  address_flat?: string;
  identifier: string;
  description: string;
  applicationId: number;
  tags?: number[];
  geometry?: any;
  addressInfo?: any;
  point?: any;
  DarekSearchList?: [];
  xCoord?: number;
  yCoord?: number;
};

export type ArchObjectCreateModel = {
  id: number;
  districtId: number;
  address: string;
  name: string;
  identifier: string;
  description: string;
  applicationId: number;
  tags?: number[];
  xCoord?: number;
  yCoord?: number;
};

export const TUNDUK_TO_REGULAR_DISTRICT_MAP = {
  7404: 4, // Ленинский р-н → Ленинский район
  7409: 3, // Октябрьский р-н → Октябрьский район
  7410: 1, // Первомайский р-н → Первомайский район
  7411: 2, // Свердловский р-н → Свердловский район
};

// Функция для получения ID обычного района по ID района Tunduk
export const getRegularDistrictId = (tundukDistrictId: number): number => {
  return TUNDUK_TO_REGULAR_DISTRICT_MAP[tundukDistrictId] || 6; // 6 - "Не определено"
};
