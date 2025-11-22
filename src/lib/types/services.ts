export type ServiceUpdate<T> = T | null;

export type ServiceDelete = {
  deleted: boolean;
};

export type ServiceCreate<T> = T | null;

export type ServiceList<T> = {
  items: T[];
  total: number;
};

export type ServiceGet<T> = T | null;
