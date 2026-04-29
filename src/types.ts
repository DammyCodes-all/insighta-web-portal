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
