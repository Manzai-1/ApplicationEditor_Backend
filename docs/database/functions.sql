-- ============================================
-- ApplyFlow Database Functions
-- ============================================

-- ============================================
-- GET FUNCTIONS
-- ============================================

-- Get full CV with all components assembled
create or replace function get_cv(p_cv_id uuid)
returns jsonb
language plpgsql
security definer
as $$
declare
  v_cv jsonb;
  v_about jsonb;
  v_skills jsonb;
  v_languages jsonb;
  v_experiences jsonb;
  v_education jsonb;
  v_certifications jsonb;
begin
  -- Get CV metadata
  select jsonb_build_object(
    'id', id,
    'user_id', user_id,
    'type', type,
    'name', name,
    'created_at', created_at,
    'updated_at', updated_at
  ) into v_cv
  from cvs where id = p_cv_id;

  if v_cv is null then
    return null;
  end if;

  -- Get about
  select jsonb_agg(
    jsonb_build_object(
      'id', a.id,
      'content', a.content,
      'sort_order', ca.sort_order
    ) order by ca.sort_order
  ) into v_about
  from cv_abouts ca
  join abouts a on a.id = ca.about_id
  where ca.cv_id = p_cv_id;

  -- Get skills
  select jsonb_agg(
    jsonb_build_object(
      'id', s.id,
      'content', s.content,
      'sort_order', cs.sort_order
    ) order by cs.sort_order
  ) into v_skills
  from cv_skills cs
  join skills s on s.id = cs.skill_id
  where cs.cv_id = p_cv_id;

  -- Get languages
  select jsonb_agg(
    jsonb_build_object(
      'id', l.id,
      'content', l.content,
      'sort_order', cl.sort_order
    ) order by cl.sort_order
  ) into v_languages
  from cv_languages cl
  join languages l on l.id = cl.language_id
  where cl.cv_id = p_cv_id;

  -- Get experiences
  select jsonb_agg(
    jsonb_build_object(
      'id', e.id,
      'content', e.content,
      'sort_order', ce.sort_order
    ) order by ce.sort_order
  ) into v_experiences
  from cv_experiences ce
  join experiences e on e.id = ce.experience_id
  where ce.cv_id = p_cv_id;

  -- Get education
  select jsonb_agg(
    jsonb_build_object(
      'id', ed.id,
      'content', ed.content,
      'sort_order', ced.sort_order
    ) order by ced.sort_order
  ) into v_education
  from cv_education ced
  join education ed on ed.id = ced.education_id
  where ced.cv_id = p_cv_id;

  -- Get certifications
  select jsonb_agg(
    jsonb_build_object(
      'id', c.id,
      'content', c.content,
      'sort_order', cc.sort_order
    ) order by cc.sort_order
  ) into v_certifications
  from cv_certifications cc
  join certifications c on c.id = cc.certification_id
  where cc.cv_id = p_cv_id;

  -- Assemble and return
  return v_cv || jsonb_build_object(
    'about', coalesce(v_about, '[]'::jsonb),
    'skills', coalesce(v_skills, '[]'::jsonb),
    'languages', coalesce(v_languages, '[]'::jsonb),
    'experiences', coalesce(v_experiences, '[]'::jsonb),
    'education', coalesce(v_education, '[]'::jsonb),
    'certifications', coalesce(v_certifications, '[]'::jsonb)
  );
end;
$$;

-- Get list of user's CVs (metadata only)
create or replace function get_user_cvs(p_user_id uuid)
returns jsonb
language plpgsql
security definer
as $$
begin
  return coalesce(
    (select jsonb_agg(
      jsonb_build_object(
        'id', id,
        'type', type,
        'name', name,
        'created_at', created_at,
        'updated_at', updated_at
      ) order by updated_at desc
    )
    from cvs
    where user_id = p_user_id),
    '[]'::jsonb
  );
end;
$$;

-- Get user profile
create or replace function get_user_profile(p_user_id uuid)
returns jsonb
language plpgsql
security definer
as $$
begin
  return (
    select jsonb_build_object(
      'id', id,
      'content', content
    )
    from profiles
    where user_id = p_user_id
  );
end;
$$;

-- ============================================
-- CREATE FUNCTIONS
-- ============================================

-- Create empty CV
create or replace function create_cv(
  p_user_id uuid,
  p_type smallint,
  p_name varchar
)
returns uuid
language plpgsql
security definer
as $$
declare
  v_cv_id uuid;
begin
  insert into cvs (user_id, type, name)
  values (p_user_id, p_type, p_name)
  returning id into v_cv_id;

  return v_cv_id;
end;
$$;

-- Create CV from template (copies all component links)
create or replace function create_cv_from_template(
  p_template_id uuid,
  p_name varchar
)
returns uuid
language plpgsql
security definer
as $$
declare
  v_user_id uuid;
  v_cv_id uuid;
begin
  -- Get user_id from template
  select user_id into v_user_id from cvs where id = p_template_id;

  if v_user_id is null then
    raise exception 'Template not found';
  end if;

  -- Create new CV as application (type = 1)
  insert into cvs (user_id, type, name)
  values (v_user_id, 1, p_name)
  returning id into v_cv_id;

  -- Copy all bridge table entries
  insert into cv_abouts (cv_id, about_id, sort_order)
  select v_cv_id, about_id, sort_order from cv_abouts where cv_id = p_template_id;

  insert into cv_skills (cv_id, skill_id, sort_order)
  select v_cv_id, skill_id, sort_order from cv_skills where cv_id = p_template_id;

  insert into cv_languages (cv_id, language_id, sort_order)
  select v_cv_id, language_id, sort_order from cv_languages where cv_id = p_template_id;

  insert into cv_experiences (cv_id, experience_id, sort_order)
  select v_cv_id, experience_id, sort_order from cv_experiences where cv_id = p_template_id;

  insert into cv_education (cv_id, education_id, sort_order)
  select v_cv_id, education_id, sort_order from cv_education where cv_id = p_template_id;

  insert into cv_certifications (cv_id, certification_id, sort_order)
  select v_cv_id, certification_id, sort_order from cv_certifications where cv_id = p_template_id;

  return v_cv_id;
end;
$$;

-- Create component and link to CV
create or replace function create_and_add_component(
  p_cv_id uuid,
  p_component_type varchar,
  p_content jsonb
)
returns uuid
language plpgsql
security definer
as $$
declare
  v_user_id uuid;
  v_component_id uuid;
  v_sort_order smallint;
begin
  -- Get user_id from CV
  select user_id into v_user_id from cvs where id = p_cv_id;

  if v_user_id is null then
    raise exception 'CV not found';
  end if;

  -- Create component and link based on type
  case p_component_type
    when 'about' then
      insert into abouts (user_id, content) values (v_user_id, p_content) returning id into v_component_id;
      select coalesce(max(sort_order) + 1, 0) into v_sort_order from cv_abouts where cv_id = p_cv_id;
      insert into cv_abouts (cv_id, about_id, sort_order) values (p_cv_id, v_component_id, v_sort_order);

    when 'skill' then
      insert into skills (user_id, content) values (v_user_id, p_content) returning id into v_component_id;
      select coalesce(max(sort_order) + 1, 0) into v_sort_order from cv_skills where cv_id = p_cv_id;
      insert into cv_skills (cv_id, skill_id, sort_order) values (p_cv_id, v_component_id, v_sort_order);

    when 'language' then
      insert into languages (user_id, content) values (v_user_id, p_content) returning id into v_component_id;
      select coalesce(max(sort_order) + 1, 0) into v_sort_order from cv_languages where cv_id = p_cv_id;
      insert into cv_languages (cv_id, language_id, sort_order) values (p_cv_id, v_component_id, v_sort_order);

    when 'experience' then
      insert into experiences (user_id, content) values (v_user_id, p_content) returning id into v_component_id;
      select coalesce(max(sort_order) + 1, 0) into v_sort_order from cv_experiences where cv_id = p_cv_id;
      insert into cv_experiences (cv_id, experience_id, sort_order) values (p_cv_id, v_component_id, v_sort_order);

    when 'education' then
      insert into education (user_id, content) values (v_user_id, p_content) returning id into v_component_id;
      select coalesce(max(sort_order) + 1, 0) into v_sort_order from cv_education where cv_id = p_cv_id;
      insert into cv_education (cv_id, education_id, sort_order) values (p_cv_id, v_component_id, v_sort_order);

    when 'certification' then
      insert into certifications (user_id, content) values (v_user_id, p_content) returning id into v_component_id;
      select coalesce(max(sort_order) + 1, 0) into v_sort_order from cv_certifications where cv_id = p_cv_id;
      insert into cv_certifications (cv_id, certification_id, sort_order) values (p_cv_id, v_component_id, v_sort_order);

    else
      raise exception 'Invalid component type: %', p_component_type;
  end case;

  return v_component_id;
end;
$$;

-- Link existing component to CV
create or replace function add_component_to_cv(
  p_cv_id uuid,
  p_component_type varchar,
  p_component_id uuid
)
returns void
language plpgsql
security definer
as $$
declare
  v_sort_order smallint;
begin
  case p_component_type
    when 'about' then
      select coalesce(max(sort_order) + 1, 0) into v_sort_order from cv_abouts where cv_id = p_cv_id;
      insert into cv_abouts (cv_id, about_id, sort_order) values (p_cv_id, p_component_id, v_sort_order);

    when 'skill' then
      select coalesce(max(sort_order) + 1, 0) into v_sort_order from cv_skills where cv_id = p_cv_id;
      insert into cv_skills (cv_id, skill_id, sort_order) values (p_cv_id, p_component_id, v_sort_order);

    when 'language' then
      select coalesce(max(sort_order) + 1, 0) into v_sort_order from cv_languages where cv_id = p_cv_id;
      insert into cv_languages (cv_id, language_id, sort_order) values (p_cv_id, p_component_id, v_sort_order);

    when 'experience' then
      select coalesce(max(sort_order) + 1, 0) into v_sort_order from cv_experiences where cv_id = p_cv_id;
      insert into cv_experiences (cv_id, experience_id, sort_order) values (p_cv_id, p_component_id, v_sort_order);

    when 'education' then
      select coalesce(max(sort_order) + 1, 0) into v_sort_order from cv_education where cv_id = p_cv_id;
      insert into cv_education (cv_id, education_id, sort_order) values (p_cv_id, p_component_id, v_sort_order);

    when 'certification' then
      select coalesce(max(sort_order) + 1, 0) into v_sort_order from cv_certifications where cv_id = p_cv_id;
      insert into cv_certifications (cv_id, certification_id, sort_order) values (p_cv_id, p_component_id, v_sort_order);

    else
      raise exception 'Invalid component type: %', p_component_type;
  end case;
end;
$$;

-- Create user profile
create or replace function create_user_profile(
  p_user_id uuid,
  p_content jsonb
)
returns uuid
language plpgsql
security definer
as $$
declare
  v_profile_id uuid;
begin
  insert into profiles (user_id, content)
  values (p_user_id, p_content)
  returning id into v_profile_id;

  return v_profile_id;
end;
$$;

-- ============================================
-- UPDATE FUNCTIONS
-- ============================================

-- Update component content
create or replace function update_component(
  p_component_type varchar,
  p_component_id uuid,
  p_content jsonb
)
returns void
language plpgsql
security definer
as $$
begin
  case p_component_type
    when 'about' then
      update abouts set content = p_content where id = p_component_id;
    when 'skill' then
      update skills set content = p_content where id = p_component_id;
    when 'language' then
      update languages set content = p_content where id = p_component_id;
    when 'experience' then
      update experiences set content = p_content where id = p_component_id;
    when 'education' then
      update education set content = p_content where id = p_component_id;
    when 'certification' then
      update certifications set content = p_content where id = p_component_id;
    else
      raise exception 'Invalid component type: %', p_component_type;
  end case;
end;
$$;

-- Update user profile
create or replace function update_user_profile(
  p_user_id uuid,
  p_content jsonb
)
returns void
language plpgsql
security definer
as $$
begin
  update profiles set content = p_content where user_id = p_user_id;
end;
$$;

-- Update CV metadata
create or replace function update_cv(
  p_cv_id uuid,
  p_name varchar
)
returns void
language plpgsql
security definer
as $$
begin
  update cvs set name = p_name where id = p_cv_id;
end;
$$;

-- Reorder components within a CV
create or replace function reorder_components(
  p_cv_id uuid,
  p_component_type varchar,
  p_ordered_ids uuid[]
)
returns void
language plpgsql
security definer
as $$
declare
  v_id uuid;
  v_index int;
begin
  for v_index in 1..array_length(p_ordered_ids, 1) loop
    v_id := p_ordered_ids[v_index];

    case p_component_type
      when 'about' then
        update cv_abouts set sort_order = v_index - 1 where cv_id = p_cv_id and about_id = v_id;
      when 'skill' then
        update cv_skills set sort_order = v_index - 1 where cv_id = p_cv_id and skill_id = v_id;
      when 'language' then
        update cv_languages set sort_order = v_index - 1 where cv_id = p_cv_id and language_id = v_id;
      when 'experience' then
        update cv_experiences set sort_order = v_index - 1 where cv_id = p_cv_id and experience_id = v_id;
      when 'education' then
        update cv_education set sort_order = v_index - 1 where cv_id = p_cv_id and education_id = v_id;
      when 'certification' then
        update cv_certifications set sort_order = v_index - 1 where cv_id = p_cv_id and certification_id = v_id;
      else
        raise exception 'Invalid component type: %', p_component_type;
    end case;
  end loop;
end;
$$;

-- ============================================
-- DELETE FUNCTIONS
-- ============================================

-- Delete CV (bridge entries cascade automatically)
create or replace function delete_cv(p_cv_id uuid)
returns void
language plpgsql
security definer
as $$
begin
  delete from cvs where id = p_cv_id;
end;
$$;

-- Remove component from CV (unlink, does not delete component)
create or replace function remove_component_from_cv(
  p_cv_id uuid,
  p_component_type varchar,
  p_component_id uuid
)
returns void
language plpgsql
security definer
as $$
begin
  case p_component_type
    when 'about' then
      delete from cv_abouts where cv_id = p_cv_id and about_id = p_component_id;
    when 'skill' then
      delete from cv_skills where cv_id = p_cv_id and skill_id = p_component_id;
    when 'language' then
      delete from cv_languages where cv_id = p_cv_id and language_id = p_component_id;
    when 'experience' then
      delete from cv_experiences where cv_id = p_cv_id and experience_id = p_component_id;
    when 'education' then
      delete from cv_education where cv_id = p_cv_id and education_id = p_component_id;
    when 'certification' then
      delete from cv_certifications where cv_id = p_cv_id and certification_id = p_component_id;
    else
      raise exception 'Invalid component type: %', p_component_type;
  end case;
end;
$$;

-- Delete component entirely (removes from all CVs via cascade, then deletes)
create or replace function delete_component(
  p_component_type varchar,
  p_component_id uuid
)
returns void
language plpgsql
security definer
as $$
begin
  case p_component_type
    when 'about' then
      delete from abouts where id = p_component_id;
    when 'skill' then
      delete from skills where id = p_component_id;
    when 'language' then
      delete from languages where id = p_component_id;
    when 'experience' then
      delete from experiences where id = p_component_id;
    when 'education' then
      delete from education where id = p_component_id;
    when 'certification' then
      delete from certifications where id = p_component_id;
    else
      raise exception 'Invalid component type: %', p_component_type;
  end case;
end;
$$;