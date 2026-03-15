-- ============================================
-- SEED DATA
-- ============================================
-- Run after schema.sql and functions.sql
-- Replace 'YOUR_USER_ID' with actual user UUID from auth.users

do $$
declare
  v_user_id uuid := '63602aa6-79dd-4a5e-b807-f077ad0440a7';
  v_cv_id uuid;
begin
  -- Create user record (links to auth.users)
  insert into users (id, email) values (v_user_id, 'Mansoor.Zainudini@gmail.com');

  -- Create profile
  perform create_user_profile(
    v_user_id,
    '{
      "name": "Mansoor Zainudini",
      "title": "Fullstack Developer",
      "email": "Mansoor.Zainudini@gmail.com",
      "phone": { "raw": "+46736698073", "display": "+46 (73) 669-8073" },
      "location": "Stockholm, Sweden",
      "linkedin": { "url": "https://linkedin.com/in/mansoor-zainudini", "display": "LinkedIn" },
      "github": { "url": "https://github.com/Manzai-1", "display": "GitHub" }
    }'::jsonb
  );

  -- Create CV (template)
  v_cv_id := create_cv(v_user_id, 0::smallint, 'Main Template');

  -- Add about
  perform create_and_add_component(
    v_cv_id,
    'about',
    '{
      "text": "I am a self-driven developer with a background in operations and project leadership, known for bringing a positive and curious mindset to any team. I grew into IT by solving real business problems and building tools that improved workflows and efficiency. I am structured, hands-on, and comfortable taking responsibility from idea to delivery."
    }'::jsonb
  );

  -- Add skills
  perform create_and_add_component(v_cv_id, 'skill', '{ "header": "Languages", "items": ["C", "C#", "Python", "JavaScript", "TypeScript", "SQL"] }'::jsonb);
  perform create_and_add_component(v_cv_id, 'skill', '{ "header": "Technologies", "items": ["React", "Node.js", "Express.js", "REST APIs", "GraphQL", "Git"] }'::jsonb);
  perform create_and_add_component(v_cv_id, 'skill', '{ "header": "Databases", "items": ["PostgreSQL", "MongoDB", "MySQL", "SQLite"] }'::jsonb);
  perform create_and_add_component(v_cv_id, 'skill', '{ "header": "Soft skills", "items": ["Problem solver", "Structured", "Hands-on", "Team player"] }'::jsonb);

  -- Add languages
  perform create_and_add_component(v_cv_id, 'language', '{ "language": "English", "level": "Fluent (spoken and written)" }'::jsonb);
  perform create_and_add_component(v_cv_id, 'language', '{ "language": "Swedish", "level": "Fluent (spoken and written)" }'::jsonb);
  perform create_and_add_component(v_cv_id, 'language', '{ "language": "Balochi", "level": "Native" }'::jsonb);

  -- Add experiences
  perform create_and_add_component(
    v_cv_id,
    'experience',
    '{
      "title": "Internship",
      "company": "Artscape",
      "year": "2026",
      "description": "Entrusted to independently improve their web3 art-print platform, delivering UX enhancements and new features.",
      "highlights": []
    }'::jsonb
  );

  perform create_and_add_component(
    v_cv_id,
    'experience',
    '{
      "title": "IT System Analyst",
      "company": "DANX",
      "year": "2020 – 2022",
      "description": "Architectural and support role within IT, bridging technical and operational teams while coordinating system development and rollouts.",
      "highlights": [
        { "title": "Shipment Data Standardization", "description": "Led requirements analysis and planning for a company-wide data standardization initiative." }
      ]
    }'::jsonb
  );

  -- Add education
  perform create_and_add_component(
    v_cv_id,
    'education',
    '{
      "title": "Full-stack and Blockchain development, Medieinstitutet",
      "year": "2024 – 2026",
      "highlights": [
        { "title": "Exam project", "description": "Created and followed a five-week development plan to build and launch a Web3 platform." },
        { "title": "Block & Order Hackathon", "description": "Participated in a 36-hour hackathon focused on AI-driven fraud detection." }
      ]
    }'::jsonb
  );

  -- Add certifications
  perform create_and_add_component(v_cv_id, 'certification', '{ "title": "CS50 Introduction to Computer Science, HarvardX" }'::jsonb);
  perform create_and_add_component(v_cv_id, 'certification', '{ "title": "Management Development Programme, DANX" }'::jsonb);
  perform create_and_add_component(v_cv_id, 'certification', '{ "title": "Welcome to leadership, The Business Leadership Academy" }'::jsonb);

  raise notice 'Seed complete. CV ID: %', v_cv_id;
end;
$$;