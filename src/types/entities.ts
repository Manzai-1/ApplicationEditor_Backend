export type Profile = {
  id: string;
  content: Record<string, unknown>;
};

export type CVMeta = {
  id: string;
  type: number;
  name: string;
  created_at: string;
  updated_at: string;
};

export type Component = {
  id: string;
  content: Record<string, unknown>;
  sort_order: number;
};

export type CV = {
  id: string;
  user_id: string;
  type: number;
  name: string;
  created_at: string;
  updated_at: string;
  about: Component[];
  skills: Component[];
  languages: Component[];
  experiences: Component[];
  education: Component[];
  certifications: Component[];
};
