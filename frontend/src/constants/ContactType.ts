import { Dayjs } from "dayjs";

export type ContactType = {
  id: number;
  name: string;
  code: string;
  description: string;
};

export type ContactTypeCreateModel = {
  id: number;
  name: string;
  code: string;
  description: string;
};
