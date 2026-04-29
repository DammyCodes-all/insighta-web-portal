export interface Profile {
  id: string;
  name?: string | null;
  gender?: string | null;
  gender_probability?: number | null;
  age?: number | null;
  age_group?: string | null;
  country_id?: string | null;
  country_name?: string | null;
  country_probability?: number | null;
  created_at?: string | null;
}

export interface ProfilesMeta {
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export interface PaginationLinks {
  self: string;
  next: string | null;
  prev: string | null;
}

export type PaginatedResponse<T> = {
  status: "success" | string;
  page: number;
  limit: number;
  total: number;
  total_pages: number;
  links?: PaginationLinks;
  data: T[];
};
