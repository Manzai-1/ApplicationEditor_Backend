-- ============================================
-- ApplyFlow Database Schema
-- ============================================

-- Enable UUID extension (Supabase usually has this enabled)
create extension if not exists "uuid-ossp";

-- ============================================
-- USERS & PROFILES
-- ============================================

-- Users table (extends Supabase auth.users)
create table public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email varchar not null unique,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Profiles (1:1 with users)
create table public.profiles (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null unique references public.users(id) on delete cascade,
  content jsonb not null default '{}',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- ============================================
-- CVs
-- ============================================

create table public.cvs (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.users(id) on delete cascade,
  type smallint not null default 0, -- 0 = template, 1 = application
  name varchar not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- ============================================
-- COMPONENTS
-- ============================================

create table public.abouts (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.users(id) on delete cascade,
  content jsonb not null default '{}',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create table public.skills (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.users(id) on delete cascade,
  content jsonb not null default '{}',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create table public.languages (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.users(id) on delete cascade,
  content jsonb not null default '{}',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create table public.experiences (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.users(id) on delete cascade,
  content jsonb not null default '{}',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create table public.education (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.users(id) on delete cascade,
  content jsonb not null default '{}',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create table public.certifications (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.users(id) on delete cascade,
  content jsonb not null default '{}',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- ============================================
-- BRIDGE TABLES
-- ============================================

create table public.cv_abouts (
  id uuid primary key default uuid_generate_v4(),
  cv_id uuid not null references public.cvs(id) on delete cascade,
  about_id uuid not null references public.abouts(id) on delete cascade,
  sort_order smallint not null default 0,
  unique(cv_id, about_id)
);

create table public.cv_skills (
  id uuid primary key default uuid_generate_v4(),
  cv_id uuid not null references public.cvs(id) on delete cascade,
  skill_id uuid not null references public.skills(id) on delete cascade,
  sort_order smallint not null default 0,
  unique(cv_id, skill_id)
);

create table public.cv_languages (
  id uuid primary key default uuid_generate_v4(),
  cv_id uuid not null references public.cvs(id) on delete cascade,
  language_id uuid not null references public.languages(id) on delete cascade,
  sort_order smallint not null default 0,
  unique(cv_id, language_id)
);

create table public.cv_experiences (
  id uuid primary key default uuid_generate_v4(),
  cv_id uuid not null references public.cvs(id) on delete cascade,
  experience_id uuid not null references public.experiences(id) on delete cascade,
  sort_order smallint not null default 0,
  unique(cv_id, experience_id)
);

create table public.cv_education (
  id uuid primary key default uuid_generate_v4(),
  cv_id uuid not null references public.cvs(id) on delete cascade,
  education_id uuid not null references public.education(id) on delete cascade,
  sort_order smallint not null default 0,
  unique(cv_id, education_id)
);

create table public.cv_certifications (
  id uuid primary key default uuid_generate_v4(),
  cv_id uuid not null references public.cvs(id) on delete cascade,
  certification_id uuid not null references public.certifications(id) on delete cascade,
  sort_order smallint not null default 0,
  unique(cv_id, certification_id)
);

-- ============================================
-- INDEXES
-- ============================================

create index idx_profiles_user_id on public.profiles(user_id);
create index idx_cvs_user_id on public.cvs(user_id);
create index idx_abouts_user_id on public.abouts(user_id);
create index idx_skills_user_id on public.skills(user_id);
create index idx_languages_user_id on public.languages(user_id);
create index idx_experiences_user_id on public.experiences(user_id);
create index idx_education_user_id on public.education(user_id);
create index idx_certifications_user_id on public.certifications(user_id);

create index idx_cv_abouts_cv_id on public.cv_abouts(cv_id);
create index idx_cv_skills_cv_id on public.cv_skills(cv_id);
create index idx_cv_languages_cv_id on public.cv_languages(cv_id);
create index idx_cv_experiences_cv_id on public.cv_experiences(cv_id);
create index idx_cv_education_cv_id on public.cv_education(cv_id);
create index idx_cv_certifications_cv_id on public.cv_certifications(cv_id);

-- ============================================
-- UPDATED_AT TRIGGER
-- ============================================

create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger users_updated_at before update on public.users
  for each row execute function public.update_updated_at();

create trigger profiles_updated_at before update on public.profiles
  for each row execute function public.update_updated_at();

create trigger cvs_updated_at before update on public.cvs
  for each row execute function public.update_updated_at();

create trigger abouts_updated_at before update on public.abouts
  for each row execute function public.update_updated_at();

create trigger skills_updated_at before update on public.skills
  for each row execute function public.update_updated_at();

create trigger languages_updated_at before update on public.languages
  for each row execute function public.update_updated_at();

create trigger experiences_updated_at before update on public.experiences
  for each row execute function public.update_updated_at();

create trigger education_updated_at before update on public.education
  for each row execute function public.update_updated_at();

create trigger certifications_updated_at before update on public.certifications
  for each row execute function public.update_updated_at();